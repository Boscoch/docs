#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const walk = require('walk-sync')
const yaml = require('js-yaml')
const frontmatter = require('../../lib/read-frontmatter')
const getDocumentType = require('../../lib/get-document-type')

const linkString = /{% [^}]*?link.*? (\/.*?) ?%}/m
const linksArray = new RegExp(linkString.source, 'gm')

<<<<<<< HEAD
// the product order is determined by data/products.yml
=======
// The product order is determined by data/products.yml
>>>>>>> 088aaf648c7a1addec3d05bb8598c3be8297a5b6
const productsFile = path.join(process.cwd(), 'data/products.yml')
const productsYml = yaml.load(fs.readFileSync(productsFile, 'utf8'))
const sortedProductIds = productsYml.productsInOrder.concat('/early-access')

<<<<<<< HEAD
=======
// This script turns `{% link /<link> %} style content into children: [ -/<link> ] frontmatter arrays.
//
// It MUST be run after script/content-migrations/remove-map-topics.js.
//
// NOTE: The results won't work with the TOC handling currently in production, so the results must NOT
// be committed until the updated handling is in place.

>>>>>>> 088aaf648c7a1addec3d05bb8598c3be8297a5b6
walk(path.join(process.cwd(), 'content'), { includeBasePath: true, directories: false })
  .filter(file => file.endsWith('index.md'))
  .forEach(file => {
    const relativePath = file.replace(`${path.join(process.cwd(), 'content/')}`, '')
    const documentType = getDocumentType(relativePath)

    const { data, content } = frontmatter(fs.readFileSync(file, 'utf8'))
    let newContent = content

    if (documentType === 'homepage') {
      data.children = sortedProductIds
    }

    const linkItems = newContent.match(linksArray) || []

    // Turn the `{% link /<link> %}` list into an array of /<link>
    if (documentType === 'product' || documentType === 'mapTopic') {
      data.children = getLinks(linkItems)
    }

    if (documentType === 'category') {
      const childMapTopics = linkItems.filter(item => item.includes('topic_'))

      data.children = childMapTopics.length ? getLinks(childMapTopics) : getLinks(linkItems)
    }

    linkItems.forEach(linkItem => {
      newContent = newContent.replace(linkItem, '').trim()
    })

<<<<<<< HEAD
    newContent = newContent.replace(/###? Table of Contents\n/i, '')
=======
    newContent = newContent
      .replace(/###? Table of Contents\n/i, '')
      .replace(/<!-- {2}-->\n/g, '')
>>>>>>> 088aaf648c7a1addec3d05bb8598c3be8297a5b6

    // Fix this one weird file
    if (relativePath === 'discussions/guides/index.md') {
      data.children = [
        '/best-practices-for-community-conversations-on-github',
        '/finding-discussions-across-multiple-repositories',
        '/granting-higher-permissions-to-top-contributors'
      ]
    }

    fs.writeFileSync(file, frontmatter.stringify(newContent.trim(), data, { lineWidth: 10000 }))
  })

function getLinks (linkItemArray) {
  // do a oneoff replacement while mapping
  return linkItemArray.map(item => item.match(linkString)[1].replace('/discussions-guides', '/guides'))
}
