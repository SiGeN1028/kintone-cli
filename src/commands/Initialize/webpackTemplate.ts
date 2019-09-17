import {WebpackParams} from '../../dto/app'
const buildWebpackReactTemplate = ({entry, useTypescript, useReact, appName, type}:WebpackParams):string => {
    let jsRules: string
    let configEntry
    let pluginConfig = ''
    if (useTypescript) {
        configEntry = 'pluginConfig.ts'
        jsRules = `{
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-typescript']
                    }
                }
            },`
        if (useReact) {
            jsRules += `{
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/react', '@babel/preset-typescript']
                    }
                }
            },`
            configEntry = 'pluginConfig.tsx'
        }
    }
    else {
        configEntry = 'config.js'
        jsRules = `{
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },`
        if (useReact) {
            jsRules += `{
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/react']
                        }
                    }
                },`
            configEntry = 'pluginConfig.jsx'
        }
    }
    if (type === 'Plugin') {
        pluginConfig = `
        const configPlugin = {
            entry: path.resolve('${appName}/source/${configEntry}'),
            resolve: {
                extensions: ['.ts', '.tsx', '.js']
            },
            output: {
                path: path.resolve('${appName}/dist'),
                filename: 'config.min.js',
            },
            module: {
                rules: [
                    ${jsRules}
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader']
                    }
                ]
            }
        }
        `
    }
    return `const path = require('path');
        const config = {
            entry: path.resolve('${appName}/source/${entry}'),
            resolve: {
                extensions: ['.ts', '.tsx', '.js']
            },
            output: {
                path: path.resolve('${appName}/dist'),
                filename: '${appName}.min.js',
            },
            module: {
                rules: [
                    ${jsRules}
                    {
                        test: /\.css$/,
                        use: ['style-loader', 'css-loader']
                    }
                ]
            }
        }

        ${pluginConfig}

        module.exports = (env, argv) => {

            if (argv.mode === 'development') {
                config.devtool = 'source-map';
            }
          
            if (argv.mode === 'production') {
              //...
            }
            ${
                type === 'Plugin' ?
                'return [config, configPlugin];':
                'return [config];'
            }
        };`
}
export default {
    buildWebpackReactTemplate
}

export {
    buildWebpackReactTemplate
}