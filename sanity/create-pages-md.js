const sanityClient = require('@sanity/client')
const path = require('path');
const fs = require('fs');
const request = require('request');
//const toMarkdown = require('@sanity/block-content-to-markdown');
const util = require('util');

const client = sanityClient({
  projectId: 'rwv0thz1',
  dataset: 'production',
  token: '', // or leave blank to be anonymous user
  useCdn: false // `false` if you want to ensure fresh data
});

// download images function
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

query = '*[_type == "photo" ] {title,description,image,"authorname": author->name,"facebook_url": author->facebook, "instagram_url": author->instagram}';

const params = {};

client.fetch(query, params).then(photos => {
  console.log('Following Photo Pages Created:');
  photos.forEach(photo => {

// Again, this is my setup, yours will probably differ
const title = `${photo.title}`;
const description = `${photo.description}`;
//const image = `${photo.image}`;
const authorname = `${photo.authorname}`;
const facebook_url = `${photo.facebook_url}`;
const instagram_url = `${photo.instagram_url}`;

var static_images = 'assets/' + `${authorname}` +'/';
var image1 = `${photo.image.asset._ref}`;
var array1 = `${image1}`.split("-");
var imageurl1 = 'https://cdn.sanity.io/images/rwv0thz1/production/' + `${array1[1]}` + "-" + `${array1[2]}` + "." + `${array1[3]}` + "?h=200";
var filename1_nopath = `${array1[1]}` + "." + `${array1[3]}`;
var filename1 = `${static_images}` + `${array1[1]}` + "." + `${array1[3]}`;
//var filename1_img = '"' + 'images/products/' + `${array1[1]}` + "." + `${array1[3]}` + '"';
var index_md = `content/${authorname}/_index.md.tmp`

console.log(title)
console.log(description)
//console.log(image)
console.log(authorname)
console.log(facebook_url)
console.log(instagram_url)

download(imageurl1, filename1, function(){
  console.log(filename1);
});

//var stream = fs.createWriteStream(`${filename1}`, {flags:'a'});
var stream = fs.createWriteStream(`${index_md}`, {flags:'a'});
stream.write("- src: " + `${authorname}/${filename1_nopath}` +"\n" + "  alt: Image\n  phototitle: " + `${title}` + "\n" + "  description: " + `${description}` + "\n");


}); // forEachphoto

}); // fetch
