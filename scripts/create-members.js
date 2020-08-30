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

query = '*[_type == "person" ] {name,memberphoto,facebook,instagram}';

const params = {};

client.fetch(query, params).then(persons => {
  console.log('Creating Members:');
  persons.forEach(person => {

// Again, this is my setup, yours will probably differ
const name = `${person.name}`;
const facebook_url = `${person.facebook}`;
const instagram_url = `${person.instagram}`;
//const image = `${photo.image}`;


var static_images = '../static/';
var image1 = `${person.memberphoto.asset._ref}`;
var array1 = `${image1}`.split("-");
var imageurl1 = 'https://cdn.sanity.io/images/rwv0thz1/production/' + `${array1[1]}` + "-" + `${array1[2]}` + "." + `${array1[3]}` + "?h=150";
var filename1_nopath = `${array1[1]}` + "." + `${array1[3]}`;
var filename1 = `${static_images}` + `${array1[1]}` + "." + `${array1[3]}`;
var filename1_asset_dir = '../assets/' + `${name}`;
var filename1_content_dir = '../content/' + `${name}`;
var filename1_index = "../content/" + `${name}` + "/_index.md";
var filename1_index_tmp = "../content/" + `${name}` + "/_index.md.tmp";
//var filename1_img = '"' + 'images/products/' + `${array1[1]}` + "." + `${array1[3]}` + '"';

console.log(name)
console.log(facebook_url)
console.log(instagram_url)

fs.mkdir(`${filename1_asset_dir}`, { recursive: true }, (err) => {
  if (err) throw err;
});

fs.mkdir(`${filename1_content_dir}`, { recursive: true }, (err) => {
  if (err) throw err;
});

download(imageurl1, filename1, function(){
  console.log(filename1);
});

/**
fs.readFile(`${filename1_index_tmp}`, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  append_data = "---\n" + data + "---";
  //console.log(append_data);
  var stream = fs.createWriteStream(`${filename1_index}`, {flags:'w'});
  stream.write(append_data);
});
**/

//var stream = fs.createWriteStream(`${filename1}`, {flags:'a'});
//var stream = fs.createWriteStream("temp.txt", {flags:'a'});
//stream.write("- src: " + `${authorname}/${filename1_nopath}` +"\n" + "  alt: Image\n  phototitle: " + `${title}` + "\n" + "  description: " + `${description}` + "\n");

}); // forEachphoto

}); // fetch
