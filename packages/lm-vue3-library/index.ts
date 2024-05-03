
import Button from '@lm-vue3-library/components/button/index';
import Select from '@lm-vue3-library/components/select/index';
const components = [
    Button,
Select
];
const install = function(app) {
    components.forEach((component) => {
        app.use(component)
    })
};
/* istanbul ignore if */
export {
// components
   Button,
Select
};
export default {
   install
};