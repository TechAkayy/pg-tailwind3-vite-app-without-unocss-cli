// Iconify icons as vue component - https://docs.iconify.design/icon-components/unocss.html
// The icons are treeshaken and processed by unocss preset-icons

// usage in template:
// <Icon name="mdi:home"></Icon>
// <Icon name="mdi:home" size="20px"></Icon>
// <Icon name="mdi:home" width="36px" height="24px"></Icon>

import { createApp } from 'vue/dist/vue.esm-bundler'

const IconComponent = {
	template: `<div :class="name" :style="sizeStyle"></div>`,
	props: {
		name: {
			type: String,
			default: ''
		},
		width: {
			type: String,
			default: '16px'
		},
		height: {
			type: String,
			default: '16px'
		},
		size: {
			type: String
		}
	},
	computed: {
		sizeStyle() {
			return {
				width: `${this.size || this.width}`,
				height: `${this.size || this.height}`
			}
		}
	}
}

const app = createApp()
app.component('Icon', IconComponent)
app.mount('#app')
