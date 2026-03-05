<template>
    <main class="footer-con">
        <div v-for="(item, index) in footerList" :key="index" class="footer-item">
            <a :href="item.href" target="_blank" rel="noopener noreferrer" class="footer-link">
                <img v-if="item.icon" :src="item.icon" :alt="item.label" class="item-icon" />
                <span class="item-text">{{ item.label }}</span>
            </a>
        </div>
        <div class="copy-right">
           <span class="name">{{`${currentYear} &nbsp; |  &nbsp; `}} </span>
            <a :href="government.href" target="_blank" rel="noreferrer" class="footer-link copyright-link">
              {{government.name}}
            </a>
        </div>
    </main>
</template>

<script>
export default {
    name: 'Footer',
    data () {
        return {
            footerList: [],
            government: {},
            currentYear : ''
        }
    },

  props: ['sidebarItems'],
  mounted() {
    this.footerList = this.$site.themeConfig.footer.friendLinks
    this.government = this.$site.themeConfig.footer.copyright
    this.currentYear =  new Date().getFullYear()
  }
}
</script>

<style lang="stylus" scoped>
@require '../styles/wrapper.styl'

.footer-con
  padding 1.25rem 0
  display flex
  justify-content center
  background-color #f8fafc
  flex-wrap wrap
  width 100%
  position relative
  margin-top auto
  border-top 1px solid #e2e8f0
  transition background-color 0.3s ease, border-color 0.3s ease

.footer-item
  padding 0.25rem 0.625rem

.footer-link
  display inline-flex
  justify-content center
  align-items center
  color #64748b
  text-decoration none
  border-radius 6px
  padding 0.375rem 0.75rem
  transition all 0.2s ease
  cursor pointer

  &:hover
    color #3b82f6
    background-color rgba(59, 130, 246, 0.08)
    transform translateY(-1px)

  &:active
    transform translateY(0)

.item-icon
  width 1rem
  height 1rem
  margin-right 0.375rem
  transition transform 0.2s ease

.footer-link:hover .item-icon
  transform scale(1.1)

.copy-right
  width 100%
  display flex
  justify-content center
  align-items center
  margin-top 0.625rem
  padding-top 0.5rem
  padding-bottom 0.5rem
  border-top 1px solid #e2e8f0
  color #64748b
  font-size 0.8125rem
  transition color 0.3s ease, border-color 0.3s ease

.copy-right .name
  margin-right 0.5rem

.copyright-link
  padding 0.25rem 0.5rem

// Sticky footer 布局
.theme-container
  min-height 100vh
  display flex
  flex-direction column

.home
.page
  flex 1

// 深色模式支持
@media (prefers-color-scheme: dark)
  .footer-con
    background-color #1e293b
    border-top-color #334155

  .footer-link
    color #94a3b8

    &:hover
      color #60a5fa
      background-color rgba(96, 165, 250, 0.12)

  .copy-right
    color #94a3b8
    border-top-color #334155

// 响应式优化
@media (max-width: $MQMobile)
  .footer-con
    padding 1rem 0

  .footer-item
    padding 0.25rem 0.375rem

  .footer-link
    font-size 0.8rem
    padding 0.375rem 0.625rem

  .copy-right
    flex-direction column
    gap 0.375rem
    padding 0.5rem 0
</style>
