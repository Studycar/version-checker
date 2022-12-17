import { MenuManagerInputDto } from 'app/modules/generated_module/dtos/menu-manager-input-dto';
/** 子菜单 */
export class ChildMenuInputDto extends MenuManagerInputDto {
    /** 关系ID */
    public ID: string;
    /** 菜单组ID */
    public MENU_GROUP_ID: string;
    /** 菜单组名称 */
    public MENU_GROUP_NAME: string;
}
