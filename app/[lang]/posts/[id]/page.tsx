import Content from './index'
import { getDictionary } from '@/dictionaries'
import { getAllPostIds, getPostData } from '@/lib/posts'
import type { PageProps } from '@/types/global'

export default async function Page({ params: { lang, id } }: PageProps) {
  const postData = await getPostData(id as string)
  const dictionary = await getDictionary(lang)
  return <Content dictionary={dictionary} postData={postData} locale={lang}></Content>
}

export const generateStaticParams = async () => {
  const defaultPaths = getAllPostIds()

  return defaultPaths.map(path => path.params)
}
