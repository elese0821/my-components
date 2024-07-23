
export interface BoardItem {
    boardIdx: number;
    title: string;
    usrNm: string;
    replyCnt: number;
    views: number;
    regDt: string;
    contents: string;
}

export type ModalState = "write" | "view" | "modify" | null;

export interface ContextType {
    list: BoardItem[];
    handleBoardData: (action: string, boardIdx: string) => void;
    handleRow: (row: number) => void;
    handleSearch: (search: string) => void;
}