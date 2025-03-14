import {type} from 'arktype'

const envSchema = type({
    // Turso
  TURSO_DATABASE_URL: "string",
  TURSO_AUTH_TOKEN: "string",
})

type Env = typeof envSchema.infer

const env = envSchema(process.env)

if (env instanceof type.errors) {
    throw env
}

export default env as Env
