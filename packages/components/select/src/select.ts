import type { ExtractPropTypes } from "vue"

export const selectProps = {
    type:{
        type: String
    }
}

export type DemoProps = ExtractPropTypes<typeof selectProps>
