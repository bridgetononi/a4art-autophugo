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

query = '*[_type == "person" ] {name,memberphoto,facebook,instagram}';

var filename1_toml = "config.toml";
var filename1_toml0 = "config0.toml";
var filename1_footer = "layouts/partials/footer.html";
var filename1_footer0 = "layouts/partials/footer0.html";

var footer_allmembers = "";

// copy congi0.toml to config.toml
var source = fs.createReadStream(`${filename1_toml0}`);
var dest = fs.createWriteStream(`${filename1_toml}`);

source.pipe(dest);
source.on('end', function() { /* copied */ });
source.on('error', function(err) { /* error */ });

const params = {};

client.fetch(query, params).then(persons => {
  console.log('Creating Members:');
  persons.forEach(person => {

// Again, this is my setup, yours will probably differ
const name = `${person.name}`;
const facebook_url = `${person.facebook}`;
const instagram_url = `${person.instagram}`;
//const image = `${photo.image}`;


var static_images = 'static/';
var image1 = `${person.memberphoto.asset._ref}`;
var array1 = `${image1}`.split("-");
var imageurl1 = 'https://cdn.sanity.io/images/rwv0thz1/production/' + `${array1[1]}` + "-" + `${array1[2]}` + "." + `${array1[3]}` + "?h=150";
var filename1_nopath = `${array1[1]}` + "." + `${array1[3]}`;
var filename1 = `${static_images}` + `${array1[1]}` + "." + `${array1[3]}`;
var filename1_asset_dir = 'assets/' + `${name}`;
var filename1_content_dir = 'content/' + `${name}`;
var filename1_index = "content/" + `${name}` + "/_index.md";
var filename1_index_tmp = "content/" + `${name}` + "/_index.md.tmp";
var filename1_toml_tmp = "config.toml." + `${name}` + '.js';
//var filename1_img = '"' + 'images/products/' + `${array1[1]}` + "." + `${array1[3]}` + '"';

console.log(name)
console.log(facebook_url)
console.log(instagram_url)

fs.readFile(`${filename1_index_tmp}`, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  append_data = "---\ntitle: " + `${name}` + "\ndate: 2020-03-15T14:06:11-06:00\nresources:\n" + data + "---";
  //console.log(append_data);
  var stream = fs.createWriteStream(`${filename1_index}`, {flags:'w'});
  stream.write(append_data);
  fs.unlink(`${filename1_index_tmp}`, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    //console.log('File deleted!');
  });

});

fs.readFile(`${filename1_toml_tmp}`, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  //append_data = "---\ntitle:" + `${name}` + "\ndate: 2020-03-15T14:06:11-06:00\nresources:\n" + data + "---";
  //console.log(append_data);
  var stream = fs.createWriteStream(`${filename1_toml}`, {flags:'a'});
  stream.write(data);
  fs.unlink(`${filename1_toml_tmp}`, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    //console.log('File deleted!');
  });

});

var footer_tmp = `
        <div>
            <section>
                <h6>{{ with .Site.Params.footer2.social.${name}.headline }}{{ . | markdownify }}{{ end }}</h6>
                <ul class="icons">
                  <p><a href="/${name}"><img src="/${name}.jpg" width=150 height=150></a></p>
                {{ range .Site.Params.footer2.social.${name}.links }}
                    <li><a href="{{ .url }}" class="icon {{ .icon }}"><span class="label">{{ .label }}</span></a></li>
                {{ end }}
            </section>
        </div>
`;

footer_allmembers = footer_allmembers + footer_tmp;

//var stream = fs.createWriteStream(`${filename1}`, {flags:'a'});
//var stream = fs.createWriteStream("temp.txt", {flags:'a'});
//stream.write("- src: " + `${authorname}/${filename1_nopath}` +"\n" + "  alt: Image\n  phototitle: " + `${title}` + "\n" + "  description: " + `${description}` + "\n");

}); // forEachphoto

fs.readFile(`${filename1_footer0}`, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  //append_data = "---\ntitle:" + `${name}` + "\ndate: 2020-03-15T14:06:11-06:00\nresources:\n" + data + "---";
  //console.log(append_data);
  var stream = fs.createWriteStream(`${filename1_footer}`, {flags:'w'});
  stream.write(data);
  stream.write('<footer id="footer2" class="panel">\n<div class="inner split">');
  stream.write(footer_allmembers);
  stream.write('</div>\n</footer>');

});

}); // fetch
