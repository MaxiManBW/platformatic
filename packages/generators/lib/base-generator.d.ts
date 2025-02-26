import { BaseLogger } from 'pino'
import { FileGenerator } from './file-generator'
import { PackageConfiguration } from './utils'
export namespace BaseGenerator {
  export type BaseGeneratorOptions = FileGenerator.FileGeneratorOptions & {
    module: string
    inquirer?: object
  }

  export type Env = {
    [key: string]: string | number | boolean
  }
  type KeyValue = {
    [key: string]: string | number | undefined | null | boolean | object
  }
  type JSONValue =
    | string
    | number
    | boolean
    | { [x: string]: JSONValue }
    | object
    | Array<JSONValue>

  type Dependency = {
    [key: string]: string
  }

  type PackageDefinition = {
    name: string,
    options: PackageConfiguration
  }
  type BaseGeneratorConfig = Record<string, any> & {
    port?: number
    hostname?: string
    plugin?: boolean
    dependencies?: Dependency
    devDependencies?: Dependency
    typescript?: boolean
    initGitRepository?: boolean
    staticWorkspaceGitHubActions?: boolean
    dynamicWorkspaceGitHubActions?: boolean
    env?: KeyValue,
    isRuntimeContext?: boolean,
    serviceName?: string,
    envPrefix?: string
  }

  type WhereClause = {
    before?: string
    after?: string
  }

  type GeneratorMetadata = {
    targetDirectory: string
    env: KeyValue
  }

  type ConfigFieldDefinition = {
    label: string
    var: string
    default: string
    type: 'number' | 'string' | 'boolean' | 'path'
    configValue?: 'string'

  }
  type ConfigField = {
    var: string
    configValue?: 'string'
    value: 'string'
  }
  export class BaseGenerator extends FileGenerator.FileGenerator {
    logger: BaseLogger
    platformaticVersion: string
    fastifyVersion: string

    config: BaseGeneratorConfig
    questions: Array<object>

    packages: PackageConfiguration[]
    constructor(opts?: BaseGeneratorOptions)

    setConfig(config?: BaseGeneratorConfig): void
    setEnv(env?: Env): void

    getDefaultConfig(): JSONValue
    getDefaultEnv(): Env

    getFastifyVersion(): Promise<string>
    getPlatformaticVersion(): Promise<string>

    addPackage(pkg: PackageDefinition): Promise<void>

    prepare(): Promise<GeneratorMetadata>
    run(): Promise<GeneratorMetadata>
    addQuestion(question: any, where?: WhereClause): Promise<void>
    removeQuestion(variableName: string): void
    getTSConfig(): JSONValue

    getConfigFieldsDefinitions(): ConfigFieldDefinition[]
    setConfigFields(fields: ConfigField[]): void

    generateConfigFile(): Promise<void>
    readPackageJsonFile(): Promise<JSONValue>
    generatePackageJson(): Promise<JSONValue>
    getConfigFileName(): string
    checkEnvVariablesInConfigFile(): boolean
    _beforePrepare(): Promise<void>
    _afterPrepare(): Promise<void | JSONValue>
    _getConfigFileContents(): Promise<JSONValue>
    _generateEnv(): Promise<void>
    appendConfigEnv(): Promise<void>

    postInstallActions(): Promise<void>
  }
}
