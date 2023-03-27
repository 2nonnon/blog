import { createContext, useContext } from 'react'
import Head from 'next/head'
import type { GetStaticProps } from 'next'
import { checkWin, generateMine, handleClickBlock, handleClickMine, handleToggleFlag, initMineSweeper } from '@/components/minesweeper/helper'
import type { Coordinate, IBlock } from '@/components/minesweeper/type'
import { BlockType, GameState, Level } from '@/components/minesweeper/type'

import useMineSweeper from '@/components/minesweeper/useMineSweeper'
import type { LocaleType } from '@/pages/_app'

const MineSweeperContext = createContext<ReturnType<typeof useMineSweeper> | null>(null)

interface BlockParam {
  block: IBlock
  coordinate: Coordinate
}

const Block = ({ block, coordinate }: BlockParam) => {
  const { mineSweeper, setMineSweeper, gameState, setGameState, flagCount, setFlagCount, gameLevel } = useContext(MineSweeperContext)!

  const handleClick: React.MouseEventHandler<HTMLDivElement> = () => {
    if (gameState === GameState.PRE) {
      const mines = generateMine(gameLevel.size, gameLevel.num, coordinate)
      setGameState(GameState.GOING)
      setMineSweeper(handleClickBlock(initMineSweeper(mineSweeper, mines), coordinate))
    }
    else if (gameState === GameState.GOING) {
      if (block.type === BlockType.BLOCK) {
        setMineSweeper(handleClickBlock(mineSweeper, coordinate))
      }

      else if (block.type === BlockType.MINE) {
        setGameState(GameState.FAIL)
        setMineSweeper(handleClickMine(mineSweeper, coordinate))
      }
    }
  }

  const handleRightClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    if (gameState === GameState.PRE) {
      const mines = generateMine(gameLevel.size, gameLevel.num, coordinate)
      setGameState(GameState.GOING)
      setFlagCount(flagCount + 1)
      setMineSweeper(handleToggleFlag(initMineSweeper(mineSweeper, mines), coordinate))
    }
    else if (gameState === GameState.GOING) {
      if (block.flag) {
        setFlagCount(flagCount - 1)
        setMineSweeper(handleToggleFlag(mineSweeper, coordinate))
      }
      else if (flagCount < gameLevel.num) {
        setFlagCount(flagCount + 1)
        const nextState = handleToggleFlag(mineSweeper, coordinate)
        if (checkWin(nextState))
          setGameState(GameState.WIN)
        setMineSweeper(nextState)
      }
    }
  }

  return (
    <>
      <div className={`h-10 w-10 rounded surface-sm ${block.hidden ? '' : 'surface-sm__active'}`}>
        {block.hidden
          ? block.flag
            ? <div className='grid place-content-center w-full h-full' onContextMenu={handleRightClick}>🚩</div>
            : <div className='cursor-pointer w-full h-full' onClick={handleClick} onContextMenu={handleRightClick}></div>
          : <div className={`grid place-content-center w-full h-full text-[hsl(${block.content * 40},50%,50%)]`}>{block.type === BlockType.BLOCK ? block.content > 0 ? block.content : '' : '💣'}</div>}
      </div>
    </>
  )
}

const copies = {
  en: {
    title: 'MineSweeper',
    refresh: 'Refresh',
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    expert: 'Expert',
    win: 'You win!',
    fail: 'You lost!',
  },
  zh: {
    title: '扫雷',
    refresh: '刷新',
    beginner: '初级',
    intermediate: '中级',
    expert: '高级',
    win: '你赢了!',
    fail: '你输了!',
  },
}

const MineSweeper = ({
  locale,
}: {
  locale: LocaleType
}) => {
  const mineSweeperInfo = useMineSweeper({ level: Level.easy, state: GameState.PRE })
  const curCopies = copies[locale]

  return (
    <>
      <Head>
        <title>{curCopies.title}</title>
      </Head>
      <MineSweeperContext.Provider value={mineSweeperInfo}>
        <h1 className='hidden'>{curCopies.title}</h1>
        <section className='grid place-content-center select-none'>
          <div>
            <div className='flex gap-4 mt-10 mb-4'>
              <span className={`surface-sm py-1 px-3 rounded ${mineSweeperInfo.gameLevel === Level.easy ? 'surface-sm__active' : ''}`} onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
                mineSweeperInfo.setGameLevel(Level.easy)
              }}>{curCopies.beginner}</span>
              <span className={`surface-sm py-1 px-3 rounded ${mineSweeperInfo.gameLevel === Level.medieum ? 'surface-sm__active' : ''}`} onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
                mineSweeperInfo.setGameLevel(Level.medieum)
              }}>{curCopies.intermediate}</span>
              <span className={`surface-sm py-1 px-3 rounded ${mineSweeperInfo.gameLevel === Level.hard ? 'surface-sm__active' : ''}`} onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
                mineSweeperInfo.setGameLevel(Level.hard)
              }}>{curCopies.expert}</span>
              <span className='surface-sm py-1 px-3 rounded' onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
              }}>{curCopies.refresh}</span>
            </div>
            <div className='flex gap-4'>
              <span className='surface-sm surface-sm__active py-1 px-3 rounded'>🚩 {mineSweeperInfo.gameLevel.num - mineSweeperInfo.flagCount}</span>
              {mineSweeperInfo.gameState === GameState.WIN || mineSweeperInfo.gameState === GameState.FAIL ? <span className='surface-sm surface-sm__active py-1 px-3 rounded'>{mineSweeperInfo.gameState === GameState.WIN ? curCopies.win : mineSweeperInfo.gameState === GameState.FAIL ? curCopies.fail : ''}</span> : null}
            </div>
          </div>
          <div className='overflow-auto -mx-6'>
            <div className={`grid grid-cols-[repeat(${mineSweeperInfo.gameLevel.size[1]},1fr)] gap-2 w-fit p-6`}>
              {mineSweeperInfo.mineSweeper.map((row, y) => row.map((block, x) => {
                return (<Block key={y * row.length + x} block={block} coordinate={[y, x]}></Block>)
              }))}
            </div>
          </div>
        </section>
      </MineSweeperContext.Provider>
    </>
  )
}

export default MineSweeper

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      a: 1,
    },
  }
}
