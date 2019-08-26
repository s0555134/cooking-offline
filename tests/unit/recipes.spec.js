import { mount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import Recipes from '@/components/Recipes.vue'

const localVue = createLocalVue()

localVue.use(Vuex)

describe('CreateRecipe.vue', () => {
    let getters
    let store

    beforeEach(() => {
        getters = {
            loadRecipe: () => 'There are no recipes at this moment. Do not wait create your own recipe for the community. Create your Recipe'
        }
        store = new Vuex.Store({
            getters
        })
    });

    it('Renders "store.getters.loadRecipe" in first v-flex tag, if no recipes are available', () => {
        const wrapper = mount(Recipes, { store, localVue })
        const vFlex = wrapper.find('v-flex')
        expect(vFlex.text()).toBe(getters.loadRecipe())
    })
    it('Data from loadRecipe is an Object', () => {
        const wrapper = mount(Recipes, { store, localVue })
        const testRecipes = {"recipes":
                [{
                    "id":"-LmZNT3TOfGsWv8mLzcu",
                    "title":"Mouse Schokola",
                    "imageURL":"https://firebasestorage.googleapis.com/v0/b/koch-pwa-db.appspot.com/o/recipes%2F-LmZNT3TOfGsWv8mLzcu.jpg?alt=media&token=c9d48587-8917-4bc2-926f-af697ccb7f9c",
                    "description":"Mit Erdbeeren kombinieren.",
                    "ingredients":["Sugar","Butter"],
                    "preparation":"Das Kochen dauert ca. 35 Minuten.",
                    "category":"Salad",
                    "creatorId":"mM2U60BLAlVjbnv49ZTsZ5It5V62"},
                    {
                        "id":"-LmhfEZx4N3ACqNBUrfT",
                        "title":"Schoko Kuchen",
                        "imageURL":"https://firebasestorage.googleapis.com/v0/b/koch-pwa-db.appspot.com/o/recipes%2F-LmhfEZx4N3ACqNBUrfT.jpg?alt=media&token=acfeb3fc-5e29-446f-9d23-4f28589b8985",
                        "description":"Schoko Kuchen schmeckt lecker. ",
                        "ingredients":["Sugar","Butter","Egg"],
                        "preparation":"Das Kochen dauert ca. 20 min.",
                        "category":"Dessert","creatorId":"mM2U60BLAlVjbnv49ZTsZ5It5V62"},
                    {
                        "id":"-LmtvdNa5RhZ2lyXDzem",
                        "title":"safe",
                        "description":"offline",
                        "ingredients":["Sugar","Butter"],
                        "preparation":"indexedDB",
                        "category":"Vegan",
                        "creatorId":"mM2U60BLAlVjbnv49ZTsZ5It5V62"
                    }
                    ]}
        getters.loadRecipe = testRecipes
        expect(typeof getters.loadRecipe).toBe("object")
    })

})
