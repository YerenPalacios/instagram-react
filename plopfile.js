module.exports = function (plop) {
    plop.setGenerator('component', {
      description: 'Crea un nuevo componente',
      prompts: [{
        type: 'input',
        name: 'name',
        message: 'Ingresa el nombre del componente:'
      }],
      actions: [{
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{kebabCase name}}.tsx',
        templateFile: 'plop-templates/Component.js.hbs'
      }, {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/{{kebabCase name}}.scss',
        templateFile: 'plop-templates/Component.css.hbs'
      }]
    });
  };