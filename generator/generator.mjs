import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

function formatString(input) {
  // Helper function to convert to camel case
  const toCamelCase = (str) => {
    return str
      .split(/[\s-_]+/) // Split on spaces, hyphens, and underscores
      .map((word, index) => {
        // Capitalize first letter of each word except the first one
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');
  };

  // Helper function to convert to pascal case
  const toPascalCase = (str) => {
    return str
      .split(/[\s-_]+/) // Split on spaces, hyphens, and underscores
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  };

  // Helper function to convert to kebab case
  const toKebabCase = (str) => {
    return str
      .split(/[\s_]+/) // Split on spaces and underscores
      .join('-')
      .toLowerCase();
  };
  const toSnakeCase = (str) => {
    return str
      .split(/[\s_]+/) // Split on spaces and underscores
      .join('_')
      .toLowerCase();
  };

  const toUpperSnakeCase = (str) => {
    return str
      .replace(/[-\s]+/g, '_') // Replace dashes and spaces with underscores
      .toUpperCase(); // Convert to uppercase
  };

  return {
    camelCase: toCamelCase(input),
    pascalCase: toPascalCase(input),
    kebabCase: toKebabCase(input),
    snakeCase: toSnakeCase(input),
    upperSnakeCase:toUpperSnakeCase(input)
  };
}

// Function to replace placeholders in templates
function replacePlaceholders(content, names) {
  return content
    .replace(/{kebab-case}/g, names.kebabCase)
    .replace(/{PascalCase}/g, names.pascalCase)
    .replace(/{camelCase}/g, names.camelCase)
    .replace(/{snake_case}/g, names.snakeCase)
    .replace(/{upper_snake_case}/g, names.upperSnakeCase)
}

// Function to generate the module files
async function generateModule(names) {
  const templateDir = path.join(process.cwd(), 'generator/templates', 'module');
  const targetDir = path.join(process.cwd(), 'src/modules', names.kebabCase);

  await fs.ensureDir(targetDir);

  // Function to recursively copy files
  async function copyFiles(srcDir, destDir) {
    const items = await fs.readdir(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(
        destDir,
        item
          .replace(/{kebab-case}/g, names.kebabCase)
          .replace(/{PascalCase}/g, names.pascalCase)
          .replace(/{camelCase}/g, names.camelCase)
          .replace(/{UPPER_SNAKE_CASE}/g, names.upperSnakeCase)
          .replace(/{ts}/g, 'ts'),
      ); // Replace placeholder

      const stat = await fs.stat(srcPath);
      if (stat.isDirectory()) {
        // If it's a directory, create it in the target and call copyFiles recursively
        await fs.ensureDir(destPath);
        await copyFiles(srcPath, destPath);
      } else {
        // If it's a file, read, replace placeholders, and write to the target
        const content = await fs.readFile(srcPath, 'utf-8');
        const processedContent = replacePlaceholders(content, names);
        await fs.writeFile(destPath, processedContent, 'utf-8');
      }
    }
  }

  await copyFiles(templateDir, targetDir);
  console.log(
    `Module "${names.kebabCase}" generated successfully in "src/modules/${names.kebabCase}"`,
  );
}

// Main function to ask user input and call the generator
async function main() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'moduleName',
      message: 'Enter the name of the module:',
    },
  ]);

  const moduleName = answers.moduleName.toLowerCase();
  const names = formatString(moduleName);
  await generateModule(names);
}

main().catch((err) => console.error(err));
