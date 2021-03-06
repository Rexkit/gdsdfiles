const base_url = window.location.origin;

/**
 * Fetching categories (async function)
 * @return {Array} Array of category objects
 */
async function fetchCategories() {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/index_category.php`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const categories = await response.json();
            return categories.data;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Fetching posts
 * @return {Array} Array of post objects
 */
async function fetchPosts(limit = 8, offset = 0, published = 'publish') {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/index_post.php?limit=${limit}&offset=${offset}&published=${published}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const posts = await response.json();
            return posts.data;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Fetching filtered posts
 * @return {Array} Array of post objects
 */
async function fetchFilteredPosts(title, category_id, max_price, exchangeable) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/filter_post.php?title=${title}&category_id=${category_id}&max_price=${max_price}&exchangeable=${exchangeable}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const posts = await response.json();
            if (posts.error) {
                return {
                    message: posts.error
                }
            }
            return posts.data;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Fetching post by id
 * @return {Object} Post object
 */
async function fetchPostById(postId) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/find_post.php?id=${postId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const post = await response.json();
            return post.data;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Fetching posts by user id
 * @return {Array} Array of post objects
 */
async function fetchPostByUserId(userId) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/find_user_posts.php?user_id=${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const posts = await response.json();
            return posts.data;
        }
    } catch (e) {
        console.log(e);
    }
}

// TO FIX
/**
 * Create a new post
 * @return {String} post id
 */
async function createPost(postFormData, postStatus) {
    const currDate = (new Date()).toISOString().split('T')[0];
    postFormData.append('created_at', currDate);
    postFormData.append('status', postStatus);
    try {
        let response = await fetch(`${base_url}/GDSD/backend/create_post.php`, {
            method: 'POST',
            mode: 'cors',
            body: postFormData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const res = await response.json();
            return {
                message: 'Post have been created',
                pid: res,
                status: true
            }
        }
    } catch (e) {
        return {
            message: e.error,
            status: false
        }
    }
}

/**
 * Edit a new post
 * @return {Object}
 */
async function editPost(postFormData, postId) {
    postFormData.append('post_id', postId);
    try {
        let response = await fetch(`${base_url}/GDSD/backend/edit_post.php`, {
            method: 'POST',
            mode: 'cors',
            body: postFormData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const res = await response.json();
            return {
                message: 'Post has been edited',
                pid: res,
                status: true
            }
        }
    } catch (e) {
        return {
            message: e.error,
            status: false
        }
    }
}

/**
 * Edit post status
 * @return {Object}
 */
async function editPostStatus(postId, status) {
    var formData = new FormData();
    formData.append('post_id', postId);
    formData.append('status', status);

    try {
        let response = await fetch(`${base_url}/GDSD/backend/update_post_status.php`, {
            method: 'POST',
            mode: 'cors',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const res = await response.json();
            console.log(res);
            return {
                message: `New post status - ${status}`,
                pid: res,
                status: true
            }
        }
    } catch (e) {
        console.log(e);
        return {
            message: e.error,
            status: false
        }
    }
}


/**
 * Fetching post category by category_id
 * @return {String} Category name
 */
async function fetchPostCategory(catId) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/find_category.php?id=${catId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const cat = await response.json();
            return cat.data.name;
        }
    } catch (e) {
        console.log(e);
    }
}

/**
 * Processing posts search
 * @param {String} searchQuery
 * @param {String} category_id
 * @return {Array} Array of post objects
 */
async function searchPosts(searchQuery = '', category_id = null) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/search_post.php?title=${searchQuery}${category_id ? '&category_id=' + category_id : null}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const posts = await response.json();
            if (posts.error) {
                return { message: posts.error }
            }
            return posts.data;
        }
    } catch (e) {
        return {
            message: e.error
        }
    }
}

/**
 * Get all users
 * @return {Array} Array of user objects
 */
async function fetchUsers() {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/index_user.php?limit=1000&offset=0`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const users = await response.json();
            if (users.error) {
                return { message: users.error }
            }
            return users.data;
        }
    } catch (e) {
        return {
            message: e.error
        }
    }
}

/**
 * Processing login request
 * @param {formData} formData Form data with user credentials
 * @return {Object} Contains state of login and message 
 */
async function loginRequest(formData) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/login_user.php`, {
            method: 'POST',
            mode: 'cors',
            body: formData
        });

        if (!response.ok) {
            throw new Error();
        } else {
            return {
                message: 'Successfuly logged in',
                status: true
            };
        }

    } catch (e) {
        return {
            message: 'Login failed',
            status: false
        };
    }
}

/**
 * Logout a user
 */
async function logoutRequest() {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/logout_user.php`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            // const users = await response.json();
            // console.log(users);
            // if (users.error) {
            //     return { message: users.error }
            // }
            // return users.data;
        }
    } catch (e) {
        return {
            status: true
        };
    }
}

/**
 * Sign up a user
 * @param {formData} formData Form data with user info
 * @return {Object} Contains state of signup and message 
 */
async function signupRequest(formData) {
    const dataToSend = JSON.stringify(Object.fromEntries(formData));
    try {
        let response = await fetch(`${base_url}/GDSD/backend/create_user.php`, {
            method: 'POST',
            mode: 'cors',
            body: dataToSend
        });

        if (!response.ok) {
            return response.json().then(json => { throw new Error(json.error) })
        } else {
            return {
                message: 'You have successfully signed up',
                status: true
            };
        }

    } catch (e) {
        console.log(e);
    }
}

/**
 * Checking if user is authenticated
 * @return {Boolean}
 */
async function checkAuthentication() {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/find_user.php`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return true;
        }
    } catch (e) {
        console.clear();
        return false;
    }
}

/**
 * Fetch logged in user
 * @return {Object} User object
 */
async function fetchCurrentUser() {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/find_user.php`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const user = await response.json();
            return user.data;
        }
    } catch (e) {
        console.clear();
        return false;
    }
}

/**
 * Delete a post
 * @return {Object} User object
 */
async function deletePost(post_id) {
    const formData = new FormData();
    formData.append('post_id', post_id);

    try {
        let response = await fetch(`${base_url}/GDSD/backend/delete_post.php`, {
            method: 'POST',
            mode: 'cors',
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return {
                message: 'The post was successfully deleted',
                status: true
            }
        }
    } catch (e) {
        return {
            message: 'Error while deleting a post',
            status: false
        };
    }
}



/**
 * Fetch images of a post
 * @return {Array} Images data array
 */
async function fetchImagesByPostId(postId) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/find_post_images.php?post_id=${postId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const imagesData = await response.json();
            const formatedData = imagesData.data.map(el => {
                return `${base_url + '/GDSD/backend/uploads/' + el.upm_path + el.upm_type}`;
            });
            return formatedData;
        }
    } catch (e) {
        return null;
    }
}

/**
 * Get parameter from Url
 * @param  {String} sParam name of parameter
 */
const getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function fetchByWish(postId, userId) {
    try {
        let response =  fetch(`${base_url}/GDSD/backend/add_to_wishlist.php?post_id=${postId}&user_id=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return response;
        }
    } catch (e) {
        console.log(e);
    }
}

async function fetchWishOfUser(postId, userId) {
    try {
        let response = await fetch(`${base_url}/GDSD/backend/get_user_wish.php?post_id=${postId}&user_id=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            const wishes = await response.json();
            return wishes.data;
        }
    } catch (e) {
        console.log(e);
    }
}

function removeUserWish(postId, userId) {
    try {
        let response =  fetch(`${base_url}/GDSD/backend/remove_from_wishlist.php?post_id=${postId}&user_id=${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            return response;
        }
    } catch (e) {
        console.log(e);
    }
}