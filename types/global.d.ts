import { LocaleType } from "@/i18n-config"

declare interface IParams {
    lang: LocaleType
    id?: string
}

declare interface PageProps {
    params: IParams
}