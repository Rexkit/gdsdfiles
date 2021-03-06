(function() {

    let postList = document.getElementById('postList'),
        searchForm = document.getElementById('side-search'),
        currentCategoryEl = document.getElementById('current-category'),
        catName = document.getElementById('category-name'),
        allCatOption = document.getElementById('all-cat-option'),
        tabContent = document.getElementById('myTabContent'),
        sortSelect = document.getElementById('sortSelect'),
        sideSearchInput = document.getElementById('side-search-input'),
        priceFilter = document.getElementById('price-filter'),
        exFilter = document.getElementById('product_exc'),
        maxPriceEl = document.getElementById('amount');

    let offest = 0,
        postsArr = [],
        category = 0,
        priceToInit = 5000,
        priceFilterState = false;
    const limit = 4;

    const init = async() => {
        const pagesCount = await initData();
        initEvents(pagesCount);

        const searchQuery = getUrlParameter('searchQuery');
        sideSearchInput.value = searchQuery;
        initPriceSlider();
    }

    const initEvents = (pagesCount) => {
        initPagination(pagesCount);

        currentCategoryEl.addEventListener('change', (event) => categorySelect(event));

        sortSelect.addEventListener('change', (event) => sortChange(event));

        searchForm.addEventListener('submit', (event) => searchData(event));

        priceFilter.addEventListener('change', (event) => priceFilterChange(event));
    }

    const priceFilterChange = (event) => {
        priceFilterState = event.target.checked;
    }

    const initPagination = (pagesCount) => {
        $('#page-pagination').html('');
        if (pagesCount) {
            if (pagesCount > 1) {
                $('#page-pagination').bootpag({
                    total: pagesCount
                }).on("page", (event, num) => loadMorePosts(event, num));
            }
        } else {
            tabContent.insertAdjacentHTML("beforeend", '<h2 class="text-center">No posts found</h2>');
        }
    }

    const sortChange = (event) => {
        const targetEl = event.target;
        const sortState = targetEl.options[targetEl.selectedIndex].value;
        switch (sortState) {
            case 'plh':
                postsArr.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                break;
            case 'phl':
                postsArr.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                break;
            case 'ms':
                postsArr.sort((a, b) => parseFloat(b.post_id) - parseFloat(a.post_id));
                break;
            default:
                break;
        }
        offest = 0;
        $('ul.bootpag>li').not('.prev').first().trigger('click');
        renderPosts(postsArr, offest, limit);
    }

    const categorySelect = (event) => {
        const targetEl = event.target;
        const newCat = targetEl.options[targetEl.selectedIndex].value;
        window.location.href = encodeURI(`search-results.html?searchQuery=${sideSearchInput.value}&searchCategory=${newCat}`);
    }

    const searchData = async event => {
        event.preventDefault();
        let maxPrice = null;
        const formData = new FormData(event.target);
        let searchQuery = formData.get('searchQuery');
        let exValue = exFilter.value;
        let catValue = category;
        if (priceFilterState) {
            maxPrice = maxPriceEl.value.substring(maxPriceEl.value.lastIndexOf('$') + 1);
        }
        if (maxPrice === null) {
            maxPrice = '';
        }
        if (exValue === 'any') {
            exValue = '';
        }
        if (catValue === '0') {
            catValue = '';
        }
        window.location.href = encodeURI(`search-results.html?searchQuery=${searchQuery}&searchCategory=${category}&max_price=${maxPrice}&exchangeable=${exValue}`);
    }

    const loadMorePosts = (event, pageNumber) => {
        offest = (pageNumber - 1) * 4;
        renderPosts(postsArr, offest, limit);
    }

    const initPriceSlider = () => {
        $("#slider-range").slider({
            range: "min",
            min: 0,
            max: 6000,
            value: priceToInit,
            slide: function(event, ui) {
                $("#amount").val(`$0 - $${ui.value}`);
            }
        });

        $("#amount").val("$0" + " - $" + $("#slider-range").slider("values", 1));
    }

    const initData = async() => {
        const searchQuery = getUrlParameter('searchQuery');
        const category_id = getUrlParameter('searchCategory');
        const maxPriceParam = getUrlParameter('max_price');
        const exchangeableParam = getUrlParameter('exchangeable');
        category = category_id;

        let categories, posts;
        if (maxPriceParam === undefined || exchangeableParam === undefined) {
            [categories, posts] = await Promise.all([
                fetchCategories(),
                searchPosts(searchQuery, category_id)
            ])
        } else {
            if (maxPriceParam !== undefined && maxPriceParam > 0) {
                priceFilter.checked = true;
                priceFilterState = true;
                priceToInit = maxPriceParam;
            }

            if (exchangeableParam !== undefined && exchangeableParam !== '') {
                exFilter.value = exchangeableParam;
            }

            [categories, posts] = await Promise.all([
                fetchCategories(),
                fetchFilteredPosts(searchQuery, category_id, maxPriceParam, exchangeableParam)
            ]);
        }

        if (posts.message && posts.message === "NOT FOUND") {
            postsArr = null;
            renderCategories(categories);
            return null;
        } else {
            postsArr = posts.reverse();
            renderCategories(categories);
            await renderPosts(postsArr, offest, limit);
            return Math.ceil(postsArr.length / limit);
        }
    }

    const renderCategories = categories => {
        if (category > 0) {
            categories.unshift(
                categories.splice(
                    categories.map((el) => el.category_id).indexOf(category),
                    1)[0]
            )
        }

        for (let i = 0; i < categories.length; i++) {
            category === categories[i].category_id && category !== '0' ? catName.innerHTML = categories[i].name : null;

            const searchCatListItem = `<option value="${categories[i].category_id}" data-tokens="${categories[i].name}">${categories[i].name}</option>`;

            currentCategoryEl.insertAdjacentHTML("beforeend", searchCatListItem);
        }

        if (category === '0') {
            catName.innerHTML = 'All'
        } else {
            allCatOption.remove();
            currentCategoryEl.insertAdjacentHTML("beforeend", `<option value="0" id="all-cat-option" data-tokens="All">All Categories</option>`);
        }


        $("#current-category").selectpicker("refresh");
    }

    const renderPosts = async(posts, offset, limit) => {
        postList.innerHTML = '';

        for (let i = offset; i < offset + limit && i < posts.length; i++) {
            const images = await fetchImagesByPostId(posts[i].post_id);

            const postItem = `
                <a href="single.html?postId=${posts[i].post_id}">
                    <li>
                        <img src="${images ? images[0] : 'assets/images/no-img.png'}" title="" alt="" />
                        <section class="list-left">
                            <h5 class="title">${posts[i].title}</h5>
                            <span class="adprice">$${posts[i].price}</span>
                            <p class="catpath">Exchangeable: ${posts[i].exchangeable}</p>
                        </section>
                        <section class="list-right">
                            <span class="date">${posts[i].created_at}</span>
                            <span class="cityname">${posts[i].city}</span>
                        </section>
                        <div class="clearfix"></div>
                    </li>
                </a>`;

            postList.insertAdjacentHTML("beforeend", postItem);
        }
    }

    init();

})();