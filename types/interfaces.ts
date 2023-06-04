import { ChangeEventHandler, Dispatch, MouseEventHandler, ReactElement, ReactNode, SetStateAction } from "react";

// index
export interface NavigationTabButtonProps {
    value: string;
    content: string;
    onTabClick: MouseEventHandler<HTMLButtonElement>;
    className: string;
}

export interface AuthorProps {
    key: string
}


// AddingTab
export interface BookAddButtonProps {
    value: string;
    className: string;
    id: string;
    children: string;
    handleAddClick: MouseEventHandler;
    isLoading: boolean;
}

export interface BookSearchButtonProps {
    value: string;
    className: string;
    id: string;
    children: ReactNode;
    handleSearchClick: MouseEventHandler;
    isLoading: boolean;
}

export interface BookAddFormProps {
    handleAddClick: MouseEventHandler;
    handleSearchClick: MouseEventHandler;
    isLoading: boolean;
}

export interface AddingTabProps {
    handleAddClick: MouseEventHandler;
    handleSearchClick: MouseEventHandler;
    isLoading: boolean;
}


// BookDetailsWindow
export interface BookDetailsInputProps {
    value: string;
    fieldType: string;
    autofocus: boolean;
    handleChange: ChangeEventHandler<HTMLInputElement>;
}

export interface BookDetailsWindowProps {
    id: string;
    title: string;
    author: string;
    publisher: string;
    genre: string;
    isbn: string;
    showDetails: boolean;
    setShowDetails: Dispatch<SetStateAction<boolean>>;
    handleEdit: Function;
    showSaveBtn: boolean;
    setShowSaveBtn: Dispatch<SetStateAction<boolean>>;
    styleSaveBtn: boolean;
    setStyleSaveBtn: Dispatch<SetStateAction<boolean>>;
}


// BookElement
export interface BookButtonsProps {
    onSwitch: Function;
    onDelete: MouseEventHandler;
    onInfo: MouseEventHandler;
    setLoadingState: Dispatch<SetStateAction<boolean>>;
}

export interface BookElementProps {
    id: string
    title: string;
    author: string;
    publisher: string;
    genre: string;
    isbn: string;
    status: string;
    onSwitch: Function;
    onDelete: MouseEventHandler;
    handleEdit: Function;
}


// BooksTab
export interface BooksStatusSectionProps {
    sectionActiveStatus: string;
    children: string;
    section: string;
    onSectionClick: MouseEventHandler;
    bookList: ReactElement[];
}