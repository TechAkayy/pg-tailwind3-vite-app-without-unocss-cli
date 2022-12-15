// @ is a vite alias for ./src folder from project root. So, we can use the @ alias to specify absolute paths relative to the project root. Especially useful when there are very deep complex folders and relative paths have to be specified between js or other assets.

import 'uno.css'

import '@/tailwind.css'

import '@/modules/vue-icon'
import '@/modules/iconify-icon'

import { tada } from '@/modules/confetti'
// tada()
document.addEventListener('click', () => tada())
