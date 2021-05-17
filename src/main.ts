import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ElButton, ElButtonGroup, ElForm, ElFormItem, ElInput, ElRadio, ElRadioGroup } from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)
app.component(ElButton.name, ElButton)
app.component(ElButtonGroup.name, ElButtonGroup)
app.component(ElForm.name, ElForm)
app.component(ElFormItem.name, ElFormItem)
app.component(ElInput.name, ElInput)
app.component(ElRadio.name, ElRadio)
app.component(ElRadioGroup.name, ElRadioGroup)
app.use(store).use(router).mount('#app')
