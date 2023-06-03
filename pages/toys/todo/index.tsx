import Head from 'next/head'
import type { GetStaticProps } from 'next'

import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'
import type { ITask } from '@/components/todo/TasksContext'
import {
  TasksProvider,
  useTasks,
  useTasksDispatch,
} from '@/components/todo/TasksContext'

interface TodoItemProps {
  task: ITask
}

const TodoItem = ({ task }: TodoItemProps) => {
  return (<>
    <li>{task.content}</li>
  </>)
}

const TodoList = () => {
  const tasks = useTasks()

  return (<>
    <ul role="list">
      {tasks.map(task => (
        <TodoItem key={task.id} task={task}></TodoItem>
      ))}
    </ul>
  </>)
}

const TodoPanel = () => {
  const taskDispatch = useTasksDispatch()

  return (<>
    <button onClick={() => {
      taskDispatch({ type: 'added', content: 'New task' })
    }}>新建</button>
  </>)
}

const Todo = ({ dictionary }: { locale: LocaleType
  dictionary: Dictionary }) => {
  const copies = dictionary.todo

  return (
    <>
      <Head>
        <title>{copies.title}</title>
        <meta name="description" content={copies.description} />
      </Head>
      <TasksProvider>
        <div className='max-w-screen-md mx-auto py-6 w-full'>
          <TodoPanel></TodoPanel>
          <TodoList></TodoList>
        </div>
      </TasksProvider>
    </>
  )
}

export default Todo

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      locale,
      dictionary,
    },
  }
}
