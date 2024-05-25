import type { ExtractPropTypes } from "vue"

export const YmdemoProps = {
    type:{
        type: String
    }
}

export type YmdemoProps = ExtractPropTypes<typeof YmdemoProps>

