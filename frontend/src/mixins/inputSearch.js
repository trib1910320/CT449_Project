import InputSearch from "@/components/InputSearch.vue";

export default {
    components: {
        InputSearch
    },
    data() {
        return {
            searchText: "",
        };
    },
    methods: {
        removeAccents(str) {
            return str.normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd').replace(/Đ/g, 'D');
        },
    },
}