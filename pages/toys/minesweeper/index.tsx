import { createContext, useContext } from 'react'
import { checkWin, generateMine, handleClickBlock, handleClickMine, handleToggleFlag, initMineSweeper } from '@/components/minesweeper/helper'
import type { Coordinate, IBlock } from '@/components/minesweeper/type'
import { BlockType, GameState, Level } from '@/components/minesweeper/type'

import useMineSweeper from '@/components/minesweeper/useMineSweeper'

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
      <div className='h-5 w-5'>
        {block.hidden
          ? block.flag
            ? <div className='grid place-content-center bg-gray-300 w-full h-full' onContextMenu={handleRightClick}>🚩</div>
            : <div className='cursor-pointer bg-gray-300 w-full h-full' onClick={handleClick} onContextMenu={handleRightClick}></div>
          : <div className='grid place-content-center bg-white w-full h-full'>{block.type === BlockType.BLOCK ? block.content > 0 ? block.content : '' : '💣'}</div>}
      </div>
    </>
  )
}

const MineSweeper = () => {
  const mineSweeperInfo = useMineSweeper({ level: Level.easy, state: GameState.PRE })

  return (
    <>
      <MineSweeperContext.Provider value={mineSweeperInfo}>
        <div className='grid place-content-center min-h-full select-none p-10'>
          <div>
            <span>{mineSweeperInfo.gameState}</span>
            <span onClick={() => {
              mineSweeperInfo.setGameState(GameState.PRE)
              mineSweeperInfo.setGameLevel(Level.easy)
            }}>初级</span>
            <span onClick={() => {
              mineSweeperInfo.setGameState(GameState.PRE)
              mineSweeperInfo.setGameLevel(Level.medieum)
            }}>中级</span>
            <span onClick={() => {
              mineSweeperInfo.setGameState(GameState.PRE)
              mineSweeperInfo.setGameLevel(Level.hard)
            }}>高级</span>
            <span onClick={() => {
              mineSweeperInfo.setGameState(GameState.PRE)
            }}>刷新</span>
          </div>
          <div className={`grid grid-cols-[repeat(${mineSweeperInfo.gameLevel.size[1]},1fr)] gap-1 w-fit p-1 bg-gray-100`}>
            {mineSweeperInfo.mineSweeper.map((row, y) => row.map((block, x) => {
              return (<Block key={y * row.length + x} block={block} coordinate={[y, x]}></Block>)
            }))}
          </div>
        </div>
      </MineSweeperContext.Provider>
    </>
  )
}

export default MineSweeper
