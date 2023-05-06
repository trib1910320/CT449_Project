<template>
    <Form @submit="submitTopping" :validation-schema="toppingFormSchema">
        <div class="modal-header">
            <h4 class="modal-title" :id="modalLabels">
                <slot></slot>
            </h4>
            <button type="button" class="btn border-0 text-danger" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="title">Name:</label>
                <Field name="name" type="text" class="form-control" v-model="toppingLocal.name"
                    placeholder="Enter name here" />
                <ErrorMessage name="name" class="error-feedback" />
            </div>
            <div class="form-group">
                <label for="title">Price:</label>
                <Field name="price" type="number" class="form-control" v-model="toppingLocal.price"
                    placeholder="Enter price here" />
                <ErrorMessage name="price" class="error-feedback" />
            </div>
        </div>
        <div class="modal-footer justify-content-center">
            <button v-if="toppingLocal._id" class="btn btn-primary" type="submit" data-bs-dismiss="modal">
                <i class="fa-solid fa-floppy-disk"></i>
                Save
            </button>
            <button v-else class="btn btn-primary" type="submit" data-bs-dismiss="modal">
                <i class="fa-solid fa-floppy-disk"></i>
                Create
            </button>
            <button v-if="toppingLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteTopping"
                data-bs-dismiss="modal">
                <i class="fa-solid fa-trash-can"></i>
                Delete
            </button>
            <button v-else type="button" class="ml-2 btn btn-danger" data-bs-dismiss="modal">
                <i class="fa-solid fa-trash-can"></i>
                Cancel
            </button>
        </div>
    </Form>
</template>
  
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form, Field, ErrorMessage,
    },
    emits: ["submit:post", "delete:post"],
    props: {
        topping: { type: Object, default: true },
        modalLabels: { type: String, default: null }

    },
    data() {
        const toppingFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Please enter the topping's  name.")
                .min(2, "Must have at least 2 characters.")
                .max(30, "Topping has at most 30 characters."),
            price: yup
                .number()
                .required("Please enter the Product's price."),
        });
        return {
            toppingLocal: this.topping,
            toppingFormSchema
        };
    },
    methods: {
        submitTopping() {
            this.$emit("submit:topping", this.toppingLocal);
        },
        deleteTopping() {
            this.$emit("delete:topping", this.toppingLocal.id);
        },
        closeCreate() {
            this.$emit("cancel");
        }
    },
}
</script>
  
<style scoped>
@import "@/assets/form.css";

label {
    margin-top: 0.25rem;
    margin-left: 0.5rem;
    font-size: medium;
    font-weight: bold;
}

input.form-control {
    border: none;
}

.form-group {
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
}

button {
    padding: 0.7rem 1.2rem;
}
</style>