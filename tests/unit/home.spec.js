import { mount } from '@vue/test-utils'
import Home from '@/components/Home.vue'
import Vue from "vue"
import router from "@/router"
import vuetify from "vuetify"

describe('Home.vue', () => {
    let wrapper;

    beforeEach(() => {
        Vue.use(vuetify);
        wrapper = mount(Home, { router } );
    });

    it('component contains a button', () => {
        expect(wrapper.contains('button')).toBe(true)
    })
    it('Current Route of Home-Component', () => {
        expect(router.history.current.name).toBe("Home")
    })

    it('Create Recipe-button after clicked, website navigate to /SignIn', () => {
        const button = wrapper.find('#HomeCreateRecipe')
        button.trigger('click')
        expect(router.history.current.name).toBe("SignIn")
    })
})
