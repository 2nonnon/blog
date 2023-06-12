import Content from './index'
import { getDictionary } from '@/dictionaries'
import type { PageProps } from '@/types/global'

export default async function Page({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang)
  return <Content dictionary={dictionary}></Content>
}
