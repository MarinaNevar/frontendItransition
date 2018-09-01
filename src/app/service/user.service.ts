import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User, Language, Theme } from '../model';
import {ErrorDto, UserEditDto, UserAddDto} from '../dto';

@Injectable()
export class UserService   {
  constructor(private http: HttpClient) { }

  addUser(userAddDto: UserAddDto) {
    return this.http.post<ErrorDto>(`${environment.serverUrl}users`, userAddDto);
  }

  getAll() {
    return this.http.get<User[]>(`${environment.serverUrl}users`);
  }

  getByUsername(username: string) {
    return this.http.get<UserEditDto>(`${environment.serverUrl}users/${username}`);
  }

  update(user: UserEditDto) {
    return this.http.put(`${environment.serverUrl}users`, user);
  }

  uploadImage(image: FormData, id: number) {
    return this.http.post(`${environment.serverUrl}users/${id}/images`, image);
  }

  delete(id: number) {
    return this.http.delete(`${environment.serverUrl}users/${id}`);
  }

  block(id: number, blocked: boolean) {
    return this.http.post(`${environment.serverUrl}users/${id}/block`, { blocked });
  }

  getThemes() {
    return this.http.get<Theme[]>(`${environment.serverUrl}users/getThemes`);
  }

  getLanguages() {
    return this.http.get<Language[]>(`${environment.serverUrl}users/getLanguages`);
  }

  setLanguage(username: string, language: Language) {
    return this.http.post(`${environment.serverUrl}users/setUserLanguage/` + username, language);
  }

  setTheme(username: string, theme: Theme) {
    return this.http.post(`${environment.serverUrl}users/setUserTheme/` + username, theme);
  }

  setRole(userId: number, role: String) {
    return this.http.post(`${environment.serverUrl}users/setUserRole/` + userId, role);
  }

  transformRoleToView(role: string): string {
    let updatedRole = role.substring(5).toLocaleLowerCase();
    updatedRole = updatedRole.charAt(0).toUpperCase() + updatedRole.slice(1);
    return updatedRole;
  }

  transformRoleToBackEnd(role: string): string {
    const updatedRole = 'ROLE_'.concat(role.toUpperCase());
    return updatedRole;
  }

  getImage(username: string) {
    // @ts-ignore
    return this.http.get<string>(`${environment.serverUrl}users/${username}/images`, {responseType: 'text'});
  }

  uniqueUsername(username: string) {
    return this.http.get<boolean>(`${environment.serverUrl}users/${username}/unique`);
  }
}
