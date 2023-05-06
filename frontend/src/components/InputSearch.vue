<template>
    <div class="input-group">
        <input type="text"
            class="form-control input-search" 
            placeholder="Enter search here" 
            :value="modelValue"
            @input="updateModelValue"
            @keyup.enter="submit"
        >
        <div class="input-group-append">
            <button class="btn btn-outline-secondary input-search" type="button" @click="submit">
                <i class="fa-solid fa-magnifying-glass"></i> Search
            </button>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        modelValue: {type:String, default:""},
    },
    emits:["submit","update:modelValue"],
    methods:{
        updateModelValue(e){
            this.$emit("update:modelValue",e.target.value);
        },
        submit(){
            this.$emit("submit"); 
        },
    },
}   
</script>
<style scoped>
.icon-search,
.input-search {
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.3);
}

.icon-search:hover {
    border: 1px solid rgba(0, 0, 0, 0.3);
}
i {
    font-size: 1.2rem;
    padding: 3px;
}
button.input-search{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
}
</style>