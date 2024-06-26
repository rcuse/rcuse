// State Management
import React, { useState } from 'react'
import { Button, Descriptions, Input, Space } from '@arco-design/web-react'
import { usePrevious } from '@rcuse/core'
import { cn } from './utils'

export default {
  title: 'State Management/usePrevious',
}

export function Basic() {
  const [value, setValue] = useState<string>('')
  const previousValue = usePrevious(value)

  return (
    <>
      <Input value={value} onChange={setValue} placeholder="请输入" />

      <Descriptions
        className={cn('mt-2')}
        column={1}
        data={[
          {
            label: '当前值',
            value,
          },
          {
            label: '先前值',
            value: previousValue,
          },
        ]}
      />
    </>
  )
}

interface Person {
  name: string
  job: string
}

function nameCompareFunction(prev: Person | undefined, next: Person) {
  if (!prev)
    return true

  if (prev.name !== next.name)
    return true

  return false
}

function jobCompareFunction(prev: Person | undefined, next: Person) {
  if (!prev)
    return true

  if (prev.job !== next.job)
    return true

  return false
}

export function ShouldUpdate() {
  const [state, setState] = useState({ name: 'Jack', job: 'student' })
  const [nameInput, setNameInput] = useState('')
  const [jobInput, setJobInput] = useState('')
  const previousName = usePrevious(state, nameCompareFunction)
  const previousJob = usePrevious(state, jobCompareFunction)

  return (
    <>
      <Space direction="vertical">
        <Space>
          <Input value={nameInput} onChange={setNameInput} placeholder="请输入" />
          <Button
            onClick={() => {
              setState(s => ({ ...s, name: nameInput }))
            }}
          >
            更新
          </Button>
        </Space>
        <Space>
          <Input value={jobInput} onChange={setJobInput} placeholder="请输入" />
          <Button
            onClick={() => {
              setState(s => ({ ...s, job: jobInput }))
            }}
          >
            更新
          </Button>
        </Space>
      </Space>

      <Descriptions
        title="当前值"
        className={cn('mt-2')}
        column={1}
        data={[
          {
            label: '姓名',
            value: state.name,
          },
          {
            label: '工作',
            value: state.job,
          },
        ]}
      />

      <Descriptions
        title="先前值"
        className={cn('mt-2')}
        column={1}
        data={[
          {
            label: '姓名',
            value: previousName?.name,
          },
          {
            label: '工作',
            value: previousJob?.job,
          },
        ]}
      />
    </>
  )
}
