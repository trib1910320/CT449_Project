<template>
    <Form @submit="submitAuth" :validation-schema="authFormSchema">
        <div class="modal-header">
            <h3 class="modal-title" :id="modalLabels">
                <slot></slot>
            </h3>
            <button class="btn border-0 text-danger" type="reset" data-bs-dismiss="modal" aria-label="Close">
                <i class="fa-sharp fa-solid fa-circle-xmark" style="font-size: 1.5rem;"></i>
            </button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="phone">Numberphone</label>
                <Field name="phone" type="text" class="form-control" v-model="authLocal.phone" />
                <ErrorMessage name="phone" class="error-feedback" />
            </div>

            <div class="form-group">
                <label for="password">Password</label>
                <Field name="password" type="password" class="form-control" v-model="authLocal.password" />
                <ErrorMessage name="password" class="error-feedback" />
            </div>
        </div>
        <div class="modal-footer justify-content-center">
            <div class="form-group">
                <button class="btn btn-success mx-1" type="submit">
                    <i class="fa-solid fa-floppy-disk mx-1"></i>
                    Login
                </button>
                <button type="reset" class="ml-2 btn btn-danger mx-1" data-bs-dismiss="modal">
                    <i class="fa-solid fa-trash-can mx-1"></i>
                    Cancel
                </button>
            </div>
        </div>
    </Form>
</template>
<script>
import * as yup from "yup";
import { Form, Field, ErrorMessage } from "vee-validate";

export default {
    components: {
        Form, Field, ErrorMessage
    },
    emits: ["submit:auth"],
    props: {
        auth: { type: Object, required: true },
        modalLabels: { type: String, default: null }
    },
    data() {
        const authFormSchema = yup.object().shape({
            phone: yup
                .string()
                .required("Please enter your numberphone.")
                .matches(
                    /((09|03|07|08|05)+([0-9]{8})\b)/g,
                    "Invalid phone number."),
            password: yup
                .string()
                .required("Please enter your password.")
                .max(50, "Password has at most 50 characters."),
        });
        return {
            authLocal: this.auth,
            authFormSchema
        };
    },
    methods: {
        submitAuth() {
            this.$emit("submit:auth", this.authLocal);
        },
    },
}
</script>

<style scoped>
@import "@/assets/form.css";

button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
}

.modal-header {
    color: blue;
    text-shadow: 2px 2px 5px #007BFF;
}
</style>