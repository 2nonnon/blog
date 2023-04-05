import Head from 'next/head'
import type { GetStaticProps } from 'next'
import type { ChangeEventHandler } from 'react'
import { useEffect, useRef, useState } from 'react'

// import NDialog from '@/components/Dialog'
import { Icon } from '@iconify-icon/react'
import style from './_index.module.css'
import type { LocaleType } from '@/pages/_app'
import { imageCompress } from '@/utils/imageCompress'

interface NUploadProps {
  onUpload?: (file: File) => void
  children?: React.ReactNode
  accept?: string
}

const NUpload = ({ onUpload, children, accept }: NUploadProps) => {
  return (<>
    <section className='flex select-none surface-sm rounded-md w-fit'>
      <label className='flex items-center py-2 px-4 gap-2 cursor-pointer'>
        <input type="file" name='file' accept={accept} className='hidden' onChange={(e) => {
          const file = (e.nativeEvent.target as HTMLInputElement).files[0]
          // console.log(file)
          onUpload?.(file)
        }}/>
        <Icon icon="uil:image-upload" className='text-xl' />
        {children}
      </label>
    </section>
  </>)
}

interface NCompareProps {
  topSrc?: string
  bottomSrc: string
}

const NCompare = ({ topSrc, bottomSrc }: NCompareProps) => {
  const [range, setRange] = useState(0)
  const imgRef = useRef<HTMLImageElement>(null)
  const rangeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (imgRef.current && rangeRef.current) {
      const { height } = imgRef.current.getBoundingClientRect()

      rangeRef.current.style.cssText = `--height: ${height}px;`
    }
  }, [imgRef.current, rangeRef.current])

  const handleChangeRange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRange(+e.target.value)
  }

  const clipPath = `inset(0 0 0 ${range / 10}%)`

  return (<>
    <section ref={rangeRef} className='w-full relative'>
      <img className='w-full' src={bottomSrc} alt="" />
      {topSrc && <img ref={imgRef} style={{ clipPath }} className='absolute inset-0' src={topSrc} alt="" />}
      {topSrc && <input className={style.slider} type='range' min={0} max={1000} value={range} onChange={handleChangeRange}></input>}
    </section>
  </>)
}

const copies = {
  en: {
    title: 'Image',
  },
  zh: {
    title: '图片',
  },
}

const getImageInfo = async (file: File) => {
  const src = URL.createObjectURL(file)
  const img = new Image()
  img.src = src
  await new Promise((resolve) => {
    img.onload = resolve
  })
  return {
    name: file.name,
    size: file.size,
    width: img.naturalWidth,
    height: img.naturalHeight,
    src,
  }
}

interface ImageInfo {
  name: string
  size: number
  width: number
  height: number
  src: string
}

const ImagePage = ({
  locale,
}: {
  locale: LocaleType
}) => {
  const curCopies = copies[locale]
  // const [show, setShow] = useState(false)
  const [origin, setOrigin] = useState<File>(null)
  const [originInfo, setOriginInfo] = useState<ImageInfo>(null)
  const [targetInfo, setTargetInfo] = useState<ImageInfo>(null)
  const [quality, setQuality] = useState(1)
  const [width, setWidth] = useState<number>(0)

  useEffect(() => {
    if (origin) {
      getImageInfo(origin).then((res) => {
        setOriginInfo(res)
      })
    }
    else {
      setOrigin(null)
    }
    setTargetInfo(null)
  }, [origin])

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      <section className='max-w-screen-lg mx-auto w-full'>
        <div className='flex flex-col-reverse py-8 gap-6 md:flex-row'>
          <div className='surface-sm__inert flex-1 rounded-md self-start overflow-hidden'>
            {originInfo
              ? <NCompare bottomSrc={originInfo.src} topSrc={targetInfo?.src}></NCompare>
              : <div className='w-full h-60 flex'><Icon className='m-auto text-9xl' icon="material-symbols:image-outline-rounded" /></div>}
          </div>
          <div className='flex flex-col gap-8 md:w-60'>
            <NUpload accept='image/png,image/jpeg,image/webp' onUpload={file => setOrigin(file)}><span>点击上传图片</span></NUpload>
            {origin && <div className='surface-sm p-4 flex flex-col gap-2 pointer-events-none rounded-md'>
              <div><span>图片名称: </span><span className='break-all'>{originInfo?.name}</span></div>
              <div><span>原始大小: </span><span>{originInfo?.size}</span></div>
              <div><span>原始宽度: </span><span>{originInfo?.width}</span></div>
              <div><span>原始高度: </span><span>{originInfo?.height}</span></div>
              <div><span>转换后大小: </span><span>{targetInfo?.size}</span></div>
              <div><span>转换后宽度: </span><span>{targetInfo?.width}</span></div>
              <div><span>转换后高度: </span><span>{targetInfo?.height}</span></div>
            </div>}
            {origin && <div className='flex flex-col gap-3 p-4 surface-sm__inert'>
              <label className='flex gap-1'>
                <span className='whitespace-nowrap'>质量: </span>
                <input type="number" className='min-w-0' value={quality} onChange={e => setQuality(+e.target.value)} />
              </label>
              <label className='flex gap-1'>
                <span className='whitespace-nowrap'>宽度: </span>
                <input type="number" className='min-w-0' value={width} onChange={e => setWidth(+e.target.value)}/>
              </label>
              <button className='surface-sm p-1 rounded-md' onClick={async () => {
                const res = await imageCompress(origin, { quality, width })
                const info = await getImageInfo(res)
                setTargetInfo(info)
              }} aria-label="transform image">
                转换
              </button>
            </div>}
            {origin && <div className='grid grid-cols-2 gap-3'>
              <button className='surface-sm p-1 rounded-md' onClick={() => {
                const link = document.createElement('a')
                link.href = targetInfo.src
                link.download = targetInfo.name
                link.click()
              }} aria-label="download image">
                下载
              </button>
              <button className='surface-sm p-1 rounded-md' onClick={() => {
                URL.revokeObjectURL(originInfo.src)
                URL.revokeObjectURL(targetInfo?.src)
                setOrigin(null)
              }} aria-label="clear image">
                清除
              </button>
            </div>}
          </div>
        </div>
      </section>
      {/* <button className='bg-white' onClick={() => { setShow(true) }} aria-label="Add user">
        点我点我点我~
      </button>
      {show
        ? <NDialog onClose={() => {
            setShow(false)
          } }>
            <NDialog.header></NDialog.header>
            <NDialog.body></NDialog.body>
            <NDialog.footer></NDialog.footer>
          </NDialog>
        : null} */}
    </>
  )
}

export default ImagePage

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      a: 1,
    },
  }
}
