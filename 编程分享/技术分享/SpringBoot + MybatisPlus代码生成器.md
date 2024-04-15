---
tags:
  - 代码生成器
---

# SpringBoot + MybatisPlus代码生成器


> 本文作者：[程序员Aurora](/author.md)
>
> 本站地址：[https://codenote.wuhobin.top](https://codenote.wuhobin.top)


 项目背景：SpringBoot3.1.0, MybatisPlus3.5.5


## 1. 添加依赖
```xml
<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-spring-boot3-starter</artifactId>
    <version>3.5.5</version>
</dependency>

<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
</dependency>

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-generator</artifactId>
    <version>3.5.5</version>
</dependency>

<dependency>
    <groupId>org.freemarker</groupId>
    <artifactId>freemarker</artifactId>
    <version>2.3.32</version>
</dependency>
```

## 2. 编写代码
```java
public class CodeGeneratorPlus {

    private static final String JDBC_URL = "jdbc:mysql://localhost:3306/test?useUnicode=true&characterEncoding=UTF-8";
    private static final String JDBC_USERNAME = "root";
    private static final String JDBC_PASSWORD = "123456";

    /**
     * 父级包名配置
     */
    private static final String PARENT_PACKAGE = "com.example";

    /**
     * 项目业务module
     */
    private static final String MODULE_NAME = "example";

    /**
     * 生成代码的 @author 值
     */
    private static final String AUTHOR = "admin";

    /**
     * 项目地址[改为自己本地项目位置]
     */
    private static final String PROJECT_PATH = "D:/idea_projects/boot/";


    /**
     * 要生成代码的表名配置
     */
    private static final String[] TABLES = {
            "t_user"
    };


    private static final DataSourceConfig.Builder DATA_SOURCE_CONFIG = new DataSourceConfig
            .Builder(JDBC_URL, JDBC_USERNAME, JDBC_PASSWORD)
            .typeConvertHandler((globalConfig, typeRegistry, metaInfo) -> {
                // 兼容旧版本转换成Integer
                if (JdbcType.TINYINT == metaInfo.getJdbcType()) {
                    return DbColumnType.BOOLEAN;
                }
                if (JdbcType.TIMESTAMP == metaInfo.getJdbcType() || JdbcType.DATE == metaInfo.getJdbcType() || metaInfo.getTypeName().toLowerCase().contains("datetime")) {
                    return DbColumnType.DATE;
                }
                return typeRegistry.getColumnType(metaInfo);
            });
    /**
     * <p>
     * MySQL 生成演示
     * </p>
     */
    public static void main(String[] args) {
        //1、配置数据源
        FastAutoGenerator.create(DATA_SOURCE_CONFIG)
                //2、全局配置
                .globalConfig(builder -> {
                    builder
                            .outputDir(PROJECT_PATH + "/" + MODULE_NAME + "/src/main/java")  //指定输出目录
                            .author(AUTHOR)    // 作者名
                            .disableOpenDir()  // 禁止打开输出目录
                            .dateType(DateType.ONLY_DATE) //时间策略
                            .commentDate("yyyy-MM-dd"); // 注释日期
                })  //3、包配置
                .packageConfig(builder -> {
                    builder
                            .parent(PARENT_PACKAGE)
                            .entity("dataobject")   // Entity 包名
                            .mapper("mapper")       // Mapper 包名
                            .service("service")    //  Service 包名
                            .serviceImpl("service.impl") //Service Impl 包名
                            .pathInfo(Collections.singletonMap(OutputFile.xml, PROJECT_PATH + "/" + MODULE_NAME + "/src/main/resources/mapper"));
                })
                .strategyConfig(builder -> {
                    builder
                            .enableCapitalMode()    //开启大写命名
                            .enableSkipView()   //创建实体类的时候跳过视图
                            .addInclude(TABLES)  // 设置需要生成的数据表名
                            .addTablePrefix("t")  //设置 过滤 表的前缀
                            .entityBuilder()       // Entity 策略配置
                            .enableLombok()       //开启 lombok 模型
                            .idType(IdType.AUTO)    // 全局主键类型
                            .formatFileName("%sDO")
                            .enableRemoveIsPrefix()  //开启 Boolean 类型字段移除 is 前缀
                            .naming(NamingStrategy.underline_to_camel)  //数据库表映射到实体的命名策略
                            .columnNaming(NamingStrategy.underline_to_camel)  //数据库表字段映射到实体的命名策略
                            .controllerBuilder()   // Controller 策略配置
                            .enableRestStyle()
                            .formatFileName("%sController")
                            .serviceBuilder()
                            .formatServiceFileName("%sService")
                            .formatServiceImplFileName("%sServiceImp")
                            .mapperBuilder()
                            .enableBaseColumnList()
                            .enableBaseResultMap()
                            .formatMapperFileName("%sMapper")
                            .formatXmlFileName("%sMapper");
                })
                .templateConfig(builder -> {
                    builder
                            .controller(null);// 不生成controller
                })
                .templateEngine(new FreemarkerTemplateEngine())
                .execute();

    }
}

```

<Vssue :title="$title" />

