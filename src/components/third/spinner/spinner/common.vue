<script>
    export default {
        props: {
            size: {
                type: Number,
                default: 0
            },
            color: {
                type: String,
                default: ''
            }
        },
        computed: {
            spinnerColor() {
                return this.color || this.$parent.color || '#ccc';
            },
            spinnerSize() {
                return (this.size || this.$parent.size || 28) + 'px';
            }
        },
    };
</script>