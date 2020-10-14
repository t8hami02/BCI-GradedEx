const { v4: uuidv4 } = require('uuid');

let userPosts = [
    {
      postId: uuidv4(),
      title: 'Vintage Lamp',
      description: 'Some description',
      category: 'furniture',
      location: 'Somestreet 12, 90100, Oulu, Finland',
      image: 'Some image',
      price: '200e',
      deliveryType:{
        shipping: true,
        pickup: false
      },
      sellerName: 'Joe Doe',
      sellerContactInfo: 'a.a@something.net',
      postDate: '9-9-2020'
    },
    {
      postId: uuidv4(),
      title: 'Old car',
      description: 'Some old car',
      category: 'car',
      location: 'Somestreet 12, 90100, Oulu, Finland',
      image: 'Some image',
      price: '400e',
      deliveryType:{
         shipping: false,
         pickup: true
      },
      sellerName: 'Sonny McDonny',
      sellerContactInfo: 'b.bbb@something.net',
      postDate: '8-9-2020'
 }
];

module.exports = {

    getAllPosts: () => userPosts,
    getPostIdByTitle: (title) => foundUser = userPosts.find(u => u.title == title).postId,
    getPostById: (id) => userPosts.find(u => u.postId == id),
    getPostsByCategory: (category) => userPosts.find(u => u.category == category),
    getPostsByLocation: (location) => userPosts.find(u => u.location == location),
    getPostsBypostDate: (postDate) => userPosts.find(u => u.postDate == postDate),
    deletePost: (id) => {
        const post = userPosts.find(u => u.postId == id);
        userPosts.splice(userPosts.findIndex(v => v.postId === post.postId), 1)
    },
    addPost: (title, description, category, location, image, price, deliveryType, sellerName, sellerContactInfo, postDate) => {
      userPosts.push({
        postId: uuidv4(),
        title,
        description,
        category,
        location,
        image,
        price,
        deliveryType,
        sellerName,
        sellerContactInfo,
        postDate
      });
    } 

}