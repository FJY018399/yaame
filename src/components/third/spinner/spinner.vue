<template>
    <span>
        <component :is="spinner"></component>
    </span>
</template>

<script>
    import './style.css';
    import SpinnerFadingCircle from './spinner/fading-circle.vue';
    import SpinnerSnake from './spinner/snake.vue';
    import SpinnerDoubleBounce from './spinner/double-bounce.vue';
    import SpinnerTripleBounce from './spinner/triple-bounce.vue';
    const SPINNERS = [
        'snake',
        'double-bounce',
        'triple-bounce',
        'fading-circle'
    ];
    const parseSpinner = function (index) {
        if ({}.toString.call(index) === '[object Number]') {
            if (SPINNERS.length <= index) {
                console.warn(`'${index}' spinner not found, use the default spinner.`);
                index = 0;
            }
            return SPINNERS[index];
        }

        if (SPINNERS.indexOf(index) === -1) {
            console.warn(`'${index}' spinner not found, use the default spinner.`);
            index = SPINNERS[0];
        }
        return index;
    };

    export default {
        name: 'Spinner',

        components: {
            SpinnerSnake,
            SpinnerDoubleBounce,
            SpinnerTripleBounce,
            SpinnerFadingCircle
        },

        props: {
            type: {
                type: String,
                default: ''
            },
            size: {
                type: Number,
                default: 28
            },
            color: {
                type: String,
                default: '#ccc'
            }
        },

        computed: {
            spinner() {
                return `spinner-${parseSpinner(this.type)}`;
            }
        },
    };
</script>