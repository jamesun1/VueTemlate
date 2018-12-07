import Layout from '../views/layout/Layout'
export function menuInit(data) {
  var result = []
  if (data) {
    data.forEach(function(menu) {
      var menuList = menu.menuList
      var childrenResult = null
      if (menuList) {
        childrenResult = menuInit(menuList)
      }
      if (menu.parentId === null) {
        result.push(
          {
            path: '/' + menu.menuPath,
            component: Layout,
            redirect: 'noredirect',
            name: menu.menuName,
            meta: {
              title: menu.menuName,
              icon: menu.icon
            },
            children: childrenResult
          }
        )
      } else {
        result.push({
          path: menu.menuPath,
          component: resolve => require(['@/views/' + menu.menuUrl + '.vue'], resolve),
          name: menu.menuName,
          meta: {
            title: menu.menuName,
            icon: menu.icon
          }
        })
      }
    })
  }
  return result
}
