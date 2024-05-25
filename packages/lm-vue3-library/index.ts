import Button from '@lm-vue3-library/components/button/index';
import Select from '@lm-vue3-library/components/select/index';
import Ymdemo from '@lm-vue3-library/components/ymdemo/index';


const components = [
  Button,Select,Ymdemo
];
const install = function(app) {
    components.forEach((component) => {
        app.use(component)
    })
};

export {
  Button,Select,Ymdemo
};

export default {
   install
};

