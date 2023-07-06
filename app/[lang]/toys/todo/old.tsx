'use client'

import { useEffect, useState } from 'react'
import type { ITask } from '@/components/todo/TasksContext'
import {
  TasksProvider,
  useTasks,
  useTasksDispatch,
} from '@/components/todo/TasksContext'
import Modal from '@/components/Modal'
import { ModalProvider, useModal, useModalDispatch } from '@/components/todo/ModalContext'

interface TodoItemProps {
  task: ITask
}

const TodoItem = ({ task }: TodoItemProps) => {
  const taskDispatch = useTasksDispatch()!
  const modalDispatch = useModalDispatch()!

  return (<>
    <li className='flex'>
      <p>{task.content}</p>
      <div>
        <button onClick={() => {
          modalDispatch({ type: 'change', task })
        }}>编辑</button>
        <button onClick={() => {
          taskDispatch({ type: 'deleted', id: task.id })
        }}>删除</button>
        <button onClick={() => {
          taskDispatch({ type: 'changed', task: { ...task, done: true } })
        }}>完成</button>
      </div>
    </li>
  </>)
}

const TodoList = () => {
  const tasks = useTasks()!

  return (<>
    <ul role="list">
      {tasks.map(task => (
        <TodoItem key={task.id} task={task}></TodoItem>
      ))}
    </ul>
  </>)
}

const TodoPanel = () => {
  const modalDispatch = useModalDispatch()!

  return (<>
    <button onClick={() => {
      modalDispatch({ type: 'add' })
    }}>新建</button>
  </>)
}

const TodoModal = () => {
  const taskDispatch = useTasksDispatch()!
  const modalDispatch = useModalDispatch()!
  const { show, task } = useModal()!
  const [content, setContent] = useState<string>()

  useEffect(() => {
    if (show)
      setContent(task?.content)
    else
      setContent(undefined)
  }, [show])

  return (<>
    {show && <Modal>
      <textarea value={content} onChange={(e) => {
        setContent(e.target.value)
      }}></textarea>
      <div>
        <button onClick={() => {
          modalDispatch({ type: 'close' })
        }}>取消</button>
        <button onClick={() => {
          if (task)
            taskDispatch({ type: 'changed', task: { ...task, content } })

          else taskDispatch({ type: 'added', content: content ?? '' })

          modalDispatch({ type: 'close' })
        }}>确定</button>
      </div>
    </Modal>}
  </>)
}

const Todo = () => {
  return (
    <>
      <TasksProvider>
        <ModalProvider>
          <div className='max-w-screen-md mx-auto py-6 w-full'>
            <TodoPanel></TodoPanel>
            <TodoList></TodoList>
            <TodoModal></TodoModal>
          </div>
        </ModalProvider>
      </TasksProvider>
    </>
  )
}

export default Todo
