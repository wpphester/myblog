

create table `user` (
  `uid` int(10) primary key auto_increment,
  `uname` varchar(20) not null unique,
  `pwd` varchar(20) not null,
  `isAdmin` tinyint(4) not null default '0'
);



create table `type` (
  `tid` int(11) primary key auto_increment,
  `tname` varchar(20) not null unique
);



create table `contents` (
  `cid` int(11) primary key auto_increment,
  `tid` int(11) not null comment '���ͱ�����',
  `uid` int(11) not null comment '�û�������',
  `title` varchar(30) character set utf8 not null comment '���ݵ��Ӿ�/��Ӱ',
  `addTime` varchar(30) collate utf8_unicode_ci default null comment '����/��ӳʱ��',
  photo varchar(200) not null comment '��Ƭ',
  `content` varchar(2000) character set utf8 not null comment '����',
  `types` varchar(20) character set utf8 not null comment '����',
  `comments` varchar(200) character set utf8 default null comment '����',
  `views` int(11) not null,
  constraint `cuid` foreign key (`uid`) references `user` (`uid`),
  constraint `ttid` foreign key (`tid`) references `type` (`tid`)
);



