MusicPlus::Application.routes.draw do
  resources :users

  root :to => 'main#discover'
end
