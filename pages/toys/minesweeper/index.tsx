import { createContext, useContext } from 'react'
import Head from 'next/head'
import type { GetStaticProps } from 'next'
import { checkWin, generateMine, handleClickBlock, handleClickMine, handleToggleFlag, initMineSweeper } from '@/components/minesweeper/helper'
import type { Coordinate, IBlock } from '@/components/minesweeper/type'
import { BlockType, GameState, Level } from '@/components/minesweeper/type'

import useMineSweeper from '@/components/minesweeper/useMineSweeper'
import type { Dictionary, LocaleType } from '@/dictionaries'
import { getDictionary } from '@/dictionaries'

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

const MineSweeper = ({ dictionary }: { locale: LocaleType
  dictionary: Dictionary }) => {
  const mineSweeperInfo = useMineSweeper({ level: Level.easy, state: GameState.PRE })
  const copies = dictionary.minesweeper

  return (
    <>
      <Head>
        <title>{copies.title}</title>
      </Head>
      <MineSweeperContext.Provider value={mineSweeperInfo}>
        <h1 className='hidden'>{copies.title}</h1>
        <section className='grid place-content-center select-none w-full'>
          <div>
            <div className='flex gap-4 mt-10 mb-4 flex-wrap'>
              <span className={`surface-sm py-1 px-3 rounded ${mineSweeperInfo.gameLevel === Level.easy ? 'surface-sm__active' : 'cursor-pointer'}`} onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
                mineSweeperInfo.setGameLevel(Level.easy)
              }}>{copies.beginner}</span>
              <span className={`surface-sm py-1 px-3 rounded ${mineSweeperInfo.gameLevel === Level.medieum ? 'surface-sm__active' : 'cursor-pointer'}`} onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
                mineSweeperInfo.setGameLevel(Level.medieum)
              }}>{copies.intermediate}</span>
              <span className={`surface-sm py-1 px-3 rounded ${mineSweeperInfo.gameLevel === Level.hard ? 'surface-sm__active' : 'cursor-pointer'}`} onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
                mineSweeperInfo.setGameLevel(Level.hard)
              }}>{copies.expert}</span>
              <span className='surface-sm py-1 px-3 rounded cursor-pointer' onClick={() => {
                mineSweeperInfo.setGameState(GameState.PRE)
              }}>{copies.refresh}</span>
            </div>
            <div className='flex gap-4'>
              <span className='surface-sm surface-sm__active py-1 px-3 rounded'>🚩 {mineSweeperInfo.gameLevel.num - mineSweeperInfo.flagCount}</span>
              {mineSweeperInfo.gameState === GameState.WIN || mineSweeperInfo.gameState === GameState.FAIL ? <span className='surface-sm surface-sm__active py-1 px-3 rounded'>{mineSweeperInfo.gameState === GameState.WIN ? copies.win : mineSweeperInfo.gameState === GameState.FAIL ? copies.fail : ''}</span> : null}
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

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const dictionary = await getDictionary(locale as LocaleType)

  return {
    props: {
      locale,
      dictionary,
    },
  }
}
