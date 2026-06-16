
export interface BoardItem {
    boardIdx: number;
    title: string;
    usrNm: string;
    usrIdx: string;
    replyCnt: number;
    views: number;
    regDt: string;
    contents: string;
    fileIdx?: number;
    fileOrgNm?: string;
}

export type ModalState = "write" | "view" | "modify" | null;

export interface ContextType {
    list: BoardItem[];
    loading: boolean;
    handleBoardData: (action: string, boardIdx: string) => void;
    handleRow: (row: number) => void;
    handleSearch: (search: string) => void;
}