import Crood from "../../board/Coord";
import * as BoardHelper from "src/interfaces/bot/helper/BoardHelper"
import {SetSquare, ContainsSquare} from "../bitboard/BitBoardUtility";

export const CreateAllBlockerBitboards = (movementMask: bigint): bigint[] => {
    const moveSquareIndices = [] as number[];
    for(let i = 0; i < 64;i++){
        if(((movementMask >> BigInt(i)) & BigInt(1)) === BigInt(1)){
            moveSquareIndices.push(i);
        }
    }

    const numPatterns = 1 << moveSquareIndices.length;
    const blockerBitBoards = Array<bigint>(numPatterns).fill(BigInt(0));
    for(let patternIndex = 0; patternIndex < numPatterns; patternIndex++){
        for(let bitIndex = 0; bitIndex < moveSquareIndices.length; bitIndex++){
            const bit = (patternIndex >> bitIndex) & 1;
            blockerBitBoards[patternIndex] = BigInt(blockerBitBoards[patternIndex]) | (BigInt(bit) << BigInt(moveSquareIndices[bitIndex]));
        }
    }
    return blockerBitBoards;
}

export const CreateMovementMask = (squareIndex: number, ortho: boolean): bigint => {
    let mask = BigInt(0);
    const directions = ortho ? BoardHelper.RookDirection : BoardHelper.BishopDirection;
    const startCrood = new Crood(squareIndex); 
    
    for(const dir in directions){
        const cr = directions[dir];
        for(let dst = 1; dst < 8; dst++){
            const crood = Crood.Add(startCrood, Crood.multiply(cr, dst));
            const nextCrood = Crood.Add(startCrood, Crood.multiply(cr, dst + 1));
            if(nextCrood.IsValidSquare()){
                mask = SetSquare(mask, crood.SquareIndex());
            }else{
                break;
            }
        }
    }
    return mask;
}

export const LegalMoveBitboardFromBlockers = (startSquare: number, blockerBitBoards: bigint, ortho: boolean): bigint => {
    let bitBoard = BigInt(0);

    const directions = ortho ? BoardHelper.RookDirection : BoardHelper.BishopDirection;
    const startCrood = new Crood(startSquare);

    for(const i in directions){
        const dir = directions[i];
        for(let dst = 0; dst < 8; dst++){
            const coord = Crood.Add(startCrood, Crood.multiply(dir, dst));
            if(coord.IsValidSquare()){
                bitBoard = SetSquare(bitBoard, coord.SquareIndex());
                if(ContainsSquare(blockerBitBoards, coord.SquareIndex())){
                    break;
                }
            }else{
                break;
            }
        }
    }

    return bitBoard;
}