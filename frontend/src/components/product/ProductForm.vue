<template>
    <Form @submit="submitProduct" :validation-schema="productFormSchema">
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
                <label for="text">Image:</label>
                <Field name="image" type="file" class="form-control my-2" v-model="productLocal.image"
                    accept=".jpg, .png" />
                <ErrorMessage name="image" class="error-feedback" />
            </div>
            <div class="form-group">
                <label for="title">Name:</label>
                <Field name="name" type="text" class="form-control" v-model="productLocal.name"
                    placeholder="Enter name here" />
                <ErrorMessage name="name" class="error-feedback" />
            </div>
            <div class="form-group">
                <div class="row">
                    <div class="col-6">
                        <label for="title">Price:</label>
                        <Field name="price" type="number" class="form-control" v-model="productLocal.price"
                            placeholder="Enter price here" />
                        <ErrorMessage name="price" class="error-feedback" />
                    </div>
                    <div class="col-6">
                        <label for="title">Type:</label>
                        <Field name="type" as="select" v-model="productLocal._typeid">
                            <option value="" disabled>Select type</option>
                            <option v-for="(type) in types" :key="type._id" :value="type._id">{{ type.name }}</option>
                        </Field>
                        <ErrorMessage name="type" class="error-feedback" />
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="title">Describe:</label>
                <Field v-slot="{ field }" v-model="productLocal.describe" name="content">
                    <textarea v-bind="field" name="describe" rows="3" class="form-control border-0"
                        placeholder="Enter describe here" />
                </Field>
                <ErrorMessage name="describe" class="error-feedback" />
            </div>

        </div>
        <div class="modal-footer justify-content-center">
            <button v-if="productLocal._id" class="btn btn-primary" type="submit" data-bs-dismiss="modal">
                <i class="fa-solid fa-floppy-disk"></i>
                Save
            </button>
            <button v-else class="btn btn-primary" type="submit" data-bs-dismiss="modal">
                <i class="fa-solid fa-floppy-disk"></i>
                Create
            </button>
            <button v-if="productLocal._id" type="button" class="ml-2 btn btn-danger" @click="deleteProduct"
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

import TypeService from "@/services/type.service";
export default {
    components: {
        Form, Field, ErrorMessage,
    },
    emits: ["submit:post", "delete:post"],
    props: {
        product: { type: Object, default: true },
        modalLabels: { type: String, default: null }

    },
    data() {
        const productFormSchema = yup.object().shape({
            name: yup
                .string()
                .required("Please enter the Product's name.")
                .min(2, "Must have at least 2 characters.")
                .max(50, "Product's name has at most 50 characters."),
            describe: yup
                .string()
                .min(2, "Must have at least 2 characters.")
                .max(100, "Product's describe has at most 100 characters."),
            price: yup
                .number()
                .required("Please enter the Product's price."),
        });
        return {
            productLocal: this.product,
            productFormSchema,
            types: []
        };
    },
    methods: {
        submitProduct() {
            this.$emit("submit:product", this.productLocal);
        },
        deleteProduct() {
            this.$emit("delete:product", this.productLocal.id);
        },
        closeCreate() {
            this.$emit("cancel");
        },
        async getTypeAll() {
            this.types = await TypeService.typeAll();
        },
    },
    created() {
        this.getTypeAll();
    }
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