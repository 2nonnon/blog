import Head from 'next/head'
import type { GetStaticProps } from 'next'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

const pannerOptions = { pan: 0 }

const Audio = ({ dictionary }: { locale: LocaleType
  dictionary: Dictionary }) => {
  const copies = dictionary.audio

  const [playing, setPlaying] = useState(false)

  const audioEl = useRef<HTMLAudioElement>()
  const [audioCtx, setAudioCtx] = useState<AudioContext>()

  const gainNode = useMemo(() => {
    return audioCtx?.createGain()
  }, [audioCtx])

  const panner = useMemo(() => {
    return audioCtx && new StereoPannerNode(audioCtx, pannerOptions)
  }, [audioCtx])

  useEffect(() => {
    setAudioCtx(new window.AudioContext())
  }, [])

  useEffect(() => {
    if (audioCtx) {
      const track = audioCtx.createMediaElementSource(audioEl.current)

      track.connect(gainNode).connect(panner).connect(audioCtx.destination)
    }
  }, [audioEl.current])

  return (
    <>
      <Head>
        <title>{copies.title}</title>
        <meta name="description" content={copies.description} />
      </Head>
      <div className='max-w-screen-md mx-auto py-6 w-full'>
        <section>
          <input type="range" id="volume" min="0" max="2" defaultValue="1" list="gain-vals" step="0.01" data-action="volume" onChange={(e) => {
            gainNode.gain.value = +e.target.value
          }} />
          <datalist id="gain-vals">
            <option value="0" label="min"/>
            <option value="2" label="max"/>
          </datalist>
          <label htmlFor="volume">VOL</label>

          <input type="range" id="panner" list="pan-vals" min="-1" max="1" defaultValue="0" step="0.01" data-action="panner" onChange={(e) => {
            panner.pan.value = +e.target.value
          }}/>
          <datalist id="pan-vals">
            <option value="-1" label="left"/>
            <option value="1" label="right"/>
          </datalist>
          <label htmlFor="panner">PAN</label>

          <button role="switch" aria-checked={playing} onClick={() => {
            if (playing) {
              audioCtx.suspend()
              setPlaying(false)
            }
            else {
              audioCtx.resume()
              setPlaying(true)
            }
          }}>
            <span>On/Off</span>
          </button>
        </section>

        <section >

          <audio ref={audioEl} src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/858/outfoxing.mp3" crossOrigin="anonymous" onEnded={() => {
            setPlaying(false)
          }}></audio>

          <button role="switch" aria-checked={playing} onClick={() => {
            if (audioCtx.state === 'suspended')
              audioCtx.resume()

            if (!playing) {
              audioEl.current.play()
              setPlaying(true)
            }
            else {
              audioEl.current.pause()
              setPlaying(false)
            }
          }}>
            <span>Play/Pause</span>
          </button>
        </section>
      </div>
    </>
  )
}

export default Audio

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      locale,
      dictionary,
    },
  }
}
