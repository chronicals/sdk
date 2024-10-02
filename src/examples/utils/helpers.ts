import { faker } from '@faker-js/faker'
import dedent from 'dedent'
import fakeUsers from './fakeUsers.js'

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getImageUrl(inputUser: {
  first_name: string
  last_name: string
}): string {
  const name = `${inputUser.first_name} ${inputUser.last_name}`
  return `https://avatars.dicebear.com/api/pixel-art/${encodeURIComponent(
    name
  )}.svg?scale=96&translateY=10`
}

export function mapToSelectOption(inputUser: {
  username: string
  first_name: string
  last_name: string
  email: string
}) {
  const name = `${inputUser.first_name} ${inputUser.last_name}`
  return {
    ...inputUser,
    value: inputUser.username,
    label: name,
    description: inputUser.email,
    imageUrl: `https://avatars.dicebear.com/api/pixel-art/${encodeURIComponent(
      name
    )}.svg?scale=96&translateY=10`,
  }
}

export function mapToIntervalUser(inputUser: {
  first_name: string
  last_name: string
  email: string
  username: string
}) {
  const name = `${inputUser.first_name} ${inputUser.last_name}`
  return {
    id: inputUser.username,
    name: name,
    email: inputUser.email,
    imageUrl: `https://avatars.dicebear.com/api/pixel-art/${encodeURIComponent(
      name
    )}.svg?scale=96&translateY=10`,
  }
}

export const fakeDb = (function fakeDb() {
  const data = fakeUsers

  return {
    async find(input: string) {
      await sleep(500)
      const inputLower = input.toLowerCase()
      return data
        .filter(v => {
          const searchStr = (v.email + v.first_name + v.last_name).toLowerCase()
          return searchStr.includes(inputLower)
        })
        .slice(0, 10)
    },
  }
})()

export function generateRows(count: number, offset = 0) {
  return Array(count)
    .fill(null)
    .map((_, i) => ({
      id: offset + i,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      description: faker.helpers.arrayElement([
        faker.word.noun(),
        faker.word.noun(),
        faker.lorem.paragraph(),
        dedent`## ${faker.word.noun()}

        ${faker.word.noun()}
        `,
        `${faker.word.noun()} **${faker.word.noun()}** ${faker.word.noun()}`,
        `${faker.word.noun()} _${faker.word.noun()}_ ${faker.word.noun()}`,
        `${faker.word.noun()} [${faker.word.noun()}](${faker.internet.url()}) ${faker.word.noun()}`,
        dedent`- ${faker.word.noun()}
         - ${faker.word.noun()}
         - ${faker.word.noun()}
        `,
        dedent`1. ${faker.word.noun()}
         2. ${faker.word.noun()}
         3. ${faker.word.noun()}
        `,
        `Here is \`inline code\``,
        dedent`~~~ts
        console.log("hello, world!");
        ~~~`,
      ]),
      number: faker.number.int(100),
      ...Object.fromEntries(
        Array(50)
          .fill(null)
          .map((_, i) => [`text_${i}`, faker.lorem.paragraph()])
      ),
      boolean: faker.datatype.boolean(),
      date: faker.date.past(),
      image: faker.image.avatar(),
      array: Array(10)
        .fill(null)
        .map(() => faker.word.noun()),
    }))
}
