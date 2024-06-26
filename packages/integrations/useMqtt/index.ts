/* eslint-disable prefer-promise-reject-errors */
import { useEffect, useRef } from 'react'
import * as mqtt from 'mqtt/dist/mqtt'
import { useBoolean, useLatest, useMemoizedFn, useUnmount } from '@rcuse/core'

import type {
  Client,
  ClientSubscribeCallback,
  IClientOptions,
  ISubscriptionGrant,
  Packet,
  PacketCallback,
  IClientPublishOptions as PublishOptions,
  IClientSubscribeOptions as SubscribeOptions,
} from 'mqtt'
import type { UseMqttOptions } from './types'

export enum ReadyState {
  Connecting = 0,
  Open = 1,
  Closing = 2,
  Closed = 3,
}

/**
 * 用于处理 Mqtt 的 Hook
 * @param url
 * @param options
 */
export function useMqtt(
  url?: string,
  {
    manual = false,
    onConnect,
    onClose,
    onReconnect,
    onMessage,
    onError,
    ...rest
  }: UseMqttOptions = {},
) {
  const mqttUrl = useRef(url)
  const mqttOpts = useRef(rest)
  const onConnectRef = useLatest(onConnect)
  const onCloseRef = useLatest(onClose)
  const onReconnectRef = useLatest(onReconnect)
  const onMessageRef = useLatest(onMessage)
  const onErrorRef = useLatest(onError)

  const mqttRef = useRef<Client>()

  const unmountedRef = useRef(false)
  const [isConnected, isConnectedAction] = useBoolean()

  const connectMqtt = (url: string = mqttUrl.current!, opts?: IClientOptions) => {
    mqttUrl.current = url
    mqttOpts.current = {
      ...mqttOpts.current,
      ...opts,
    }

    if (mqttRef.current)
      mqttRef.current.end()

    if (!mqttUrl.current)
      return

    const mt = mqtt.connect(mqttUrl.current, mqttOpts.current)

    mt.on('connect', (event) => {
      if (unmountedRef.current)
        return

      isConnectedAction.setTrue()
      onConnectRef.current?.(event)
    })

    mt.on('reconnect', (...args) => {
      if (unmountedRef.current)
        return

      onReconnectRef.current?.(...args)
    })

    mt.on('message', (...args) => {
      if (unmountedRef.current)
        return

      onMessageRef.current?.(...args)
    })

    mt.on('close', () => {
      if (unmountedRef.current)
        return

      isConnectedAction.setFalse()
      onCloseRef.current?.()
    })

    mt.on('error', (error) => {
      if (unmountedRef.current)
        return

      onErrorRef.current?.(error)
    })

    mqttRef.current = mt
  }

  const disconnect = () => {
    if (mqttRef.current?.connected)
      mqttRef.current.end()
  }

  /**
   * 向服务端推送消息
   * @param args
   * @returns
   */
  const publish = (
    topic: string,
    message: string | any,
    opts?: PublishOptions,
    callback?: PacketCallback,
  ) => {
    return new Promise<Packet>((resolve, reject) => {
      if (mqttRef.current?.connected) {
        mqttRef.current.publish(topic, message, opts!, (error, packet) => {
          callback?.(error, packet)
          if (error) {
            reject(error)
            return
          }

          resolve(packet!)
        })
        return
      }

      reject('mqtt no connected')
    })
  }

  const reconnect = () => {
    mqttRef.current?.reconnect()
  }

  /**
   * 订阅通道
   * @param topic
   * @param opts
   * @param callback
   * @returns
   */
  const subscribe = (
    topic: string,
    opts: SubscribeOptions = {} as unknown as SubscribeOptions,
    callback?: ClientSubscribeCallback,
  ) => {
    return new Promise<ISubscriptionGrant[]>((resolve, reject) => {
      if (mqttRef.current?.connected) {
        mqttRef.current?.subscribe(topic, opts, (error, granted) => {
          callback?.(error, granted)
          if (error) {
            reject(error)
            return
          }

          resolve(granted)
        })
        return
      }

      reject('mqtt no connected')
    })
  }

  /**
   * 取消订阅通道
   * @param topic
   * @param opts
   * @param callback
   * @returns
   */
  const unsubscribe = (topic: string | string[], opts?: object, callback?: PacketCallback) => {
    return new Promise<Packet>((resolve, reject) => {
      if (mqttRef.current?.connected) {
        mqttRef.current?.unsubscribe(topic, opts, (error, packet) => {
          callback?.(error, packet)
          if (error) {
            reject(error)
            return
          }

          resolve(packet!)
        })
        return
      }

      reject(Error('mqtt no connected'))
    })
  }

  useEffect(() => {
    if (!manual)
      connectMqtt()
  }, [url, manual])

  useUnmount(() => {
    unmountedRef.current = true
    disconnect()
  })

  return {
    connected: isConnected,
    mqttIns: mqttRef.current,
    connect: useMemoizedFn(connectMqtt),
    reconnect: useMemoizedFn(reconnect),
    disconnect: useMemoizedFn(disconnect),
    subscribe: useMemoizedFn(subscribe),
    unsubscribe: useMemoizedFn(unsubscribe),
    publish: useMemoizedFn(publish),
  }
};

export type { UseMqttOptions } from './types'
