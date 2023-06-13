import { LocaleType } from "@/i18n-config"

export interface IParams {
    lang: LocaleType
    id?: string
}

export interface PageProps {
    params: IParams
}