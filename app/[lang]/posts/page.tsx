import Content from './index'
import { getDictionary } from '@/dictionaries'
import { getSortedPostsData } from '@/lib/posts'
import type { PageProps } from '@/types/global'

export default async function Page({ params: { lang } }: PageProps) {
  const dictionary = await getDictionary(lang)

  const allPostsData = getSortedPostsData()

  return <Content dictionary={dictionary} allPostsData={allPostsData} locale={lang}></Content>
}
